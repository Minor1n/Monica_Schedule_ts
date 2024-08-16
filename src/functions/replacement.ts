import pdf from 'pdf-parse'
import WordExtractor from 'word-extractor'
import {Input} from "telegraf";
import {gradients, bot} from "../index";
import {Functions} from "./index";
import {Groups} from "../classes/Group";
import {Users} from "../classes/User";
import {Replacements} from "../classes/Replacement";
import {HtmlToImage} from "../classes/HtmlToImage";
const extractor = new WordExtractor();

type Replacement = {
    date:number
    html:string
    typeFile:string
    fileBuffer:Buffer
    link:string
}
type GenerateHTML = {
    text: string;
    group: string;
    pair: string|undefined;
    auditorium: string;
}[]

export async function regenerate(url:string,date:string):Promise<Replacement>{
    return new Promise(async function (resolve) {
        let res = await fetch(url).catch(e => {console.log(e)})
        let result:Replacement = {
            date: new Date(`${date.slice(-4)}-${date.slice(3, 5)}-${date.slice(0, 2)}`).getTime(),
            html: 'null',
            typeFile: url.slice(-3),
            fileBuffer: res?.ok? Buffer.from(await res.clone().arrayBuffer()):Buffer.from([0]),
            link: url
        };
        if(res?.ok){
            let arrFile = []
            let data = result.typeFile === 'pdf' ? (await pdf(result.fileBuffer)).text : (await extractor.extract(result.fileBuffer)).getBody()
            let groups = (await new Groups().load()).all.map(x => x.name)
            let textArr = data.replace(/\t/g, ' ').split('\n').filter(x =>
                !x.startsWith('Группа') && !x.startsWith('ПАРА') && x.replace(' ', '') !== '' && !x.startsWith('ПРЕПОДАВАТЕЛЬ') && !x.startsWith('ЗАМЕНА') && x.replace(' ', '') !== 'ПО' && !x.startsWith('РАСПИСАНИЮ')
            )
            let i = 0
            for (let _ in textArr) {
                if (textArr[i]) {
                    if (textArr[i].match(/ЗАМЕНЫ/g) === null) {
                        let group:string='', text: any[]|string = '', length = 1;
                        groups.some(v => {
                            group = v;
                            return String(textArr[i]).includes(v.replace('-', ' '));
                        })
                        if (groups.some(v => {
                            group = v;
                            return String(textArr[i]).includes(v);
                        }) || groups.some(v => {
                            group = v;
                            return String(textArr[i]).includes(v.replace('-', ' '));
                        })) {
                            text = [textArr[i]]
                            if (textArr[i + 1] && !groups.some(v => String(textArr[i + 1]).includes(v)) && !groups.some(v => {
                                return String(textArr[i + 1]).includes(v.replace('-', ' '));
                            }) && textArr[i + 1].match(/ЗАМЕНЫ/g) === null) {
                                text.push(`${textArr[i + 1]}`)
                                if (textArr[i + 2] && !groups.some(v => String(textArr[i + 2]).includes(v)) && !groups.some(v => {
                                    return String(textArr[i + 2]).includes(v.replace('-', ' '));
                                }) && textArr[i + 2].match(/ЗАМЕНЫ/g) === null) {
                                    text.push(`${textArr[i + 2]}`)
                                    if (textArr[i + 3] && !groups.some(v => String(textArr[i + 3]).includes(v)) && !groups.some(v => {
                                        return String(textArr[i + 3]).includes(v.replace('-', ' '));
                                    }) && textArr[i + 3].match(/ЗАМЕНЫ/g) === null) {
                                        text.push(`${textArr[i + 3]}`)
                                        if (textArr[i + 4] && !groups.some(v => String(textArr[i + 4]).includes(v)) && !groups.some(v => {
                                            return String(textArr[i + 4]).includes(v.replace('-', ' '));
                                        }) && textArr[i + 4].match(/ЗАМЕНЫ/g) === null) {
                                            text.push(`${textArr[i + 4]}`)
                                            if (textArr[i + 5] && !groups.some(v => String(textArr[i + 5]).includes(v)) && !groups.some(v => {
                                                return String(textArr[i + 5]).includes(v.replace('-', ' '));
                                            }) && textArr[i + 5].match(/ЗАМЕНЫ/g) === null) {
                                                text.push(`${textArr[i + 5]}`)
                                                if (textArr[i + 6] && !groups.some(v => String(textArr[i + 6]).includes(v)) && !groups.some(v => {
                                                    return String(textArr[i + 6]).includes(v.replace('-', ' '));
                                                }) && textArr[i + 6].match(/ЗАМЕНЫ/g) === null) {
                                                    text.push(`${textArr[i + 6]}`)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            length = text.length
                            if(group){
                                text = text.join(' ').slice(group.length + 1)
                            }
                        } else {
                            if(group){
                                text = textArr[i].slice(group.length + 1)
                            }
                        }
                        if (typeof text === "string") {
                            let auditorium = text.replace(/ +/g, ' ').split(/\. (?=[А-Яа-я0-9(])|\) (?=[А-Яа-я0-9(])/g).reverse()[0]
                            let pair = text.replace(/ +/g, ' ').match(/[0-9]п([,\-])[0-9]п|[0-9]([,\-])[0-9]п|[0-9]п|[0-9]/)?.[0]
                            if(pair)
                            text = text.replace(/ +/g, ' ').replace(pair, '').replace(auditorium, '')
                            arrFile.push({text: `${text}`, group: group, pair: pair, auditorium: auditorium})
                            i += length
                        }
                    } else {
                        arrFile.push({
                            text: `${textArr[i]} ${textArr[i + 1]}`,
                            group: 'null',
                            pair: 'null',
                            auditorium: 'null'
                        });
                        i += 2
                    }
                }
            }
            result.html = await generateHTML(arrFile)
        }
        resolve(result)
    })
}

export async function sender(replacement:Replacement){
    let users = await new Users().load()
    let replacements = await new Replacements().load()
    let oldReplacement = replacements.getReplacement(0)
    if(replacement.html !== 'null'&& replacement.html !== oldReplacement.html){
        replacements.insertReplacement(replacement.link,replacement.date,replacement.html)
        let gradient = gradients.dark
        let i = await new HtmlToImage(gradient,replacement.html).getImage()
        for(let user of users.all){
            let htmlImg = `background-image: url(${user.settings.theme});`
            let image = user.settings.theme === 'standard' ? i : await new HtmlToImage(htmlImg,replacement.html).getImage()
            if(user.payment.status !== 0 && user.settings.replacement ==='on' && await Functions.payment.groupTG(user)){
                // @ts-ignore
                await bot.telegram.sendPhoto(user.userId, Input.fromBuffer(Buffer.from(image), `replacement.png`))
                    .then(async ()=>{await Functions.payment.alert(user)}).catch(e=>{console.log(e)})
            }
        }
    }else{
        await bot.telegram.sendMessage(6018898378,'Замены не найдены')
    }
}

async function generateHTML(arr:GenerateHTML):Promise<string>{
    let finalArr = []
    for(let key in arr){
        if(arr[key].group === 'null'){
            finalArr.push(`<tr><td colspan="8"><b>${arr[key].text}</b></td></tr>`)
            finalArr.push(`<tr><td><b>Группа</b></td><td><b>Пара</b></td><td colspan="2"><b>По расписанию</b></td><td><b><===></b></td><td colspan="2"><b>Замена</b></td><td><b>Аудитория</b></td></tr>`)
            finalArr.push(`<tr><td colspan="8" class="line"></td></tr>`)
        }else {
            let re = /[А-Я][а-я]+ [А-Я].[А-Я].|\([а-я]+\)|\([А-Яа-я0-9 .]+ +[А-Яа-я0-9 .]+\)|[А-Яа-я0-9]+/g
            let text = arr[key].text.replace(/ +/g,' ')
            let words = text.match(re)
            let words2 = []
            let n  = 0
            for(let w in words){
                if(Number(w) === n){
                    if(words[Number(w)+1]&&words[Number(w)+1].startsWith('(')){
                        let g = [`${words[Number(w)]}`,`\n${words[Number(w)+1]}`]
                        if(words[Number(w)+2]&&words[Number(w)+2].startsWith('(')){
                            g.push(`\n${words[Number(w) + 2]}`)
                            if(words[Number(w)+3]&&words[Number(w)+3].startsWith('(')){
                                g.push(`\n${words[Number(w)+3]}`)
                            }
                        }
                        n += g.length
                        words2.push(g.join(' '))
                    }else{
                        words2.push(words[Number(w)])
                        n+=1
                    }
                }
            }
            let words3 = `<td colspan="5"><b>${words2.join(' ')}</b></td>`
            if(words2.length===1){
                words3 = `<td colspan="2"><b>${words2[0]}</b></td><td><b></b></td><td colspan="2"><b></b></td>`
            }else if(words2.length===3){
                words3 = `<td colspan="2"><b>${words2[0]}</b></td><td><b>${words2[1]}</b></td><td colspan="2"><b>${words2[2]}</b></td>`
            }else
            if(words2.length===2){
                words3 = `<td colspan="2"><b>${words2[0]}</b></td><td><b></b></td><td colspan="2"><b>${words2[1]}</b></td>`
            }else if(words2.length===4){
                words3 = `<td><b>${words2[0]}</b></td><td><b>${words2[1]}</b></td><td></td><td><b>${words2[2]}</b></td><td><b>${words2[3]}</b></td>`
            }
            if(arr[Number(key)+1]?.group==='null'){
                finalArr.push(`<tr><td><b>${arr[key].group}</b></td><td><b>${arr[key].pair}</b></td>${words3}<td><b>${arr[key].auditorium}</b></td></tr>`)
                finalArr.push(`<tr><td colspan="8" class="line"></td></tr>`)
            }else{
                finalArr.push(`<tr><td><b>${arr[key].group}</b></td><td><b>${arr[key].pair}</b></td>${words3}<td><b>${arr[key].auditorium}</b></td></tr>`)
            }
        }
    }
    return finalArr.join('')
}