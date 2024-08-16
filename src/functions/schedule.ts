import {Functions} from "./index";
import XLSX from 'xlsx'
import {Input} from "telegraf";
import {gradients, bot} from "../index";
import {Users} from "../classes/User";
import {Groups} from "../classes/Group";
import {HtmlToImage} from "../classes/HtmlToImage";

type Schedule={
    group:string;
    html:string;
    date:number;
}[]

export async function regenerate (url:string,date:string):Promise<Schedule|string>{
    return new Promise(async function (resolve) {
        let response = await fetch(url).catch(e => {console.log(e)})
        let result:Schedule|string = []
        if (!response?.ok) {
            result = 'notfound'
        } else {
            let dateTo = new Date(`${date.slice(-4)}-${date.slice(3,5)}-${date.slice(0,2)}`).getTime()
            let groups = []
            let users = await new Users().load()
            for (let user of users.all) {
                if (groups.indexOf(user.info.groupName) === -1 && user.info.groupName !== 'null') {
                    groups.push(user.info.groupName)
                }
            }
            for (let group of groups) {
                let html = await generateHTML(response, group)
                result.push({group: group, html: html, date: dateTo})
            }
        }
        resolve(result)
    })
}


export async function sender(schedule:Schedule|string){
    let groups = await new Groups().load()
    if(schedule === 'notfound'){
        await bot.telegram.sendMessage(6018898378, 'Расписание не найдено' ).catch(e=>{console.log(e)})
    }else{
        for (let s of schedule){
            if(typeof s!=='string'&&s.html !== ''){
                let group = groups.getGroup(s.group)
                if(group){
                    group.schedule = s.html
                    let gradient = gradients.light
                    let i = await new HtmlToImage(gradient,s.html).getImage()
                    for(let user of group.users){
                        if(user.payment.status !== 0 && user.settings.schedule ==='on' && await Functions.payment.groupTG(user)){
                            let htmlImg = `background-image: url(${user.settings.theme});`
                            let image = user.settings.theme === "standard" ? i : await new HtmlToImage(htmlImg,s.html).getImage()
                            //@ts-ignore
                            await bot.telegram.sendPhoto(user.info.id, Input.fromBuffer(Buffer.from(image), `schedule.png`))
                                .then(async ()=>{await Functions.payment.alert(user)}).catch(e=>{console.log(e)})
                        }
                    }
                }
            }
        }
    }
}


async function generateHTML(response:Response,group:string):Promise<string>{
    const workbook = XLSX.read(Buffer.from(await response.clone().arrayBuffer()))
    const sheet_name_list = workbook.SheetNames;
    let worksheet = workbook.Sheets[sheet_name_list[1]];
    let num, arr = []
    // let newWorksheet=[[],[],[],[],[],[]]
    for (let z in worksheet) {
        if(z.toString()[0] === 'B'){
            if(worksheet[z].v === group){
                num = Number(z.slice(1))-3
                for(let i = num+1; i < num+28; i++){
                    let content = []
                    content.push( worksheet[`A${i}`] ? `<td><b>${worksheet[`A${i}`].v}</b></td>` : `<td></td>` )
                    content.push( worksheet[`B${i}`] ? `<td><b>${worksheet[`B${i}`].v}</b></td>` : `<td></td>` )
                    content.push( worksheet[`C${i}`] ? `<td><b>${worksheet[`C${i}`].v}</b></td>` : `<td></td>` )
                    content.push( worksheet[`D${i}`] ? `<td><b>${worksheet[`D${i}`].v}</b></td>` : `<td></td>` )
                    content.push( worksheet[`E${i}`] ? `<td><b>${worksheet[`E${i}`].v}</b></td>` : `<td></td>` )
                    content.push( worksheet[`F${i}`] ? `<td><b>${worksheet[`F${i}`].v}</b></td>` : `<td></td>` )
                    content.push( worksheet[`G${i}`] ? `<td><b>${worksheet[`G${i}`].v}</b></td>` : `<td></td>` )
                    arr.push((i-num) % 4 === 0 ? `<tr>${content.join(' ')}</tr><tr><td colspan="7" class="line"></td></tr>` : `<tr>${content.join(' ')}</tr>`)
                }
                // for(let i =  num+4; i < num+28; i++ ){
                //     let B=((i-num-2)%4===0 && worksheet[`B${i}`])?await Functions.schedule.array(i,num,worksheet,"B"):undefined,
                //         C=((i-num-2)%4===0 && worksheet[`C${i}`])?await Functions.schedule.array(i,num,worksheet,"C"):undefined,
                //         D=((i-num-2)%4===0 && worksheet[`D${i}`])?await Functions.schedule.array(i,num,worksheet,"D"):undefined,
                //         E=((i-num-2)%4===0 && worksheet[`E${i}`])?await Functions.schedule.array(i,num,worksheet,"E"):undefined,
                //         F=((i-num-2)%4===0 && worksheet[`F${i}`])?await Functions.schedule.array(i,num,worksheet,"F"):undefined,
                //         G=((i-num-2)%4===0 && worksheet[`G${i}`])?await Functions.schedule.array(i,num,worksheet,"G"):undefined;
                //     B!==undefined?newWorksheet[0].push(B):null;
                //     C!==undefined?newWorksheet[1].push(C):null;
                //     D!==undefined?newWorksheet[2].push(D):null;
                //     E!==undefined?newWorksheet[3].push(E):null;
                //     F!==undefined?newWorksheet[4].push(F):null;
                //     G!==undefined?newWorksheet[5].push(G):null;
                // }
            }
        }
    }
    // await Functions.schedule.counter(newWorksheet)
    return arr.join('')
}