import {SQL, User} from "../sql";
import nodeHtmlToImage from "node-html-to-image";
import {config} from "../config";
import {bot} from "../index";
import {Input} from "telegraf";
import {Functions} from "./index";

export async function sender(){
    let users = await SQL.users.select_all()
    let gradients = await SQL.gradients.select_all_gradients()
    let gradient = gradients[Math.floor(Math.random() * (gradients.length-1))]
    let groups = []
    let htmls = new Map()
    for (let user of users) {
        if (groups.indexOf(user.groupName) === -1 && user.groupName !== 'null') {
            groups.push(user.groupName)
        }
    }
    for(let group of groups){
        let html = await generateHTML(group,0)
        let i = await nodeHtmlToImage({
            html: `${config.HTMLSTART1}${gradient}${config.HTMLSTART2}${html}${config.HTMLEND}`,
            puppeteerArgs: config.PUPPETEER
        })
        htmls.set(group,{html:html,standard:i})
    }
    for(let user of users){
        if(user.payment !== 0 && user.settingsDuty ==='on' && await Functions.payment.groupTG(user)){
            if(user.userId===6018898378){
            let htmlImg = `background-image: url(${user.theme});`
            let image = user.theme === "standard" ? htmls.get(user.groupName).standard : await nodeHtmlToImage({
                html: `${config.HTMLSTART1}${htmlImg}${config.HTMLSTART2}${htmls.get(user.groupName).html}${config.HTMLEND}`,
                puppeteerArgs: config.PUPPETEER
            })
            // @ts-ignore
            await bot.telegram.sendPhoto(user.userId, Input.fromBuffer(Buffer.from(image), `duty.png`))
                .then(async ()=>{await Functions.payment.alert(user)}).catch(e=>{console.log(e)})
        }}
    }
}

export async function generateHTML(group:string,num:number):Promise<string>{
    let users = await SQL.users.select_all_by_group(group)
    let arr:string[][] =  [[],[],[],[],[],[]]
    let arr2:string[][] = [[],[],[],[],[],[]]
    let arr3:string[][] = [[],[],[],[],[],[]]
    let resSchedule = []
    let resDuty = []
    let resTop = []
    let sortUsers = users.sort((a,b)=>b.duty-a.duty)
    for(let user of users){
        if(user.scheduleDate!==-1){
            arr[user.scheduleDate-1].push(user.name)
        }
    }
    for (let user of sortUsers){
        if(user.scheduleDate!==-1){
            arr3[user.scheduleDate-1].push(`${user.name}-${user.duty}`)
        }
    }
    let curr = new Date(new Date().getTime()-604800000*num);
    let first = curr.getDate() - curr.getDay();
    let last = first+6
    let firstDay = new Date(curr.setDate(first));
    let lastDay = new Date(curr.setDate(last))
    let duties = await SQL.duty.select(group,firstDay.getTime(),lastDay.getTime())
    for(let duty of duties){
        let day = new Date(duty.date).getDay()
        arr2[day-1].push(duty.name)
    }
    for(let i = 0;i<5;i++){
        resSchedule.push(`<tr><td><b>${arr[0]&&arr[0][i]?arr[0][i]:''}</b></td><td><b>${arr[1]&&arr[1][i]?arr[1][i]:''}</b></td><td><b>${arr[3]&&arr[2][i]?arr[2][i]:''}</b></td><td><b>${arr[3]&&arr[3][i]?arr[3][i]:''}</b></td><td><b>${arr[4]&&arr[4][i]?arr[4][i]:''}</b></td><td><b>${arr[5]&&arr[5][i]?arr[5][i]:''}</b></td></tr>`)
        resDuty.push(`<tr><td><b>${arr2[0]&&arr2[0][i]?arr2[0][i]:''}</b></td><td><b>${arr2[1]&&arr2[1][i]?arr2[1][i]:''}</b></td><td><b>${arr2[2]&&arr2[2][i]?arr2[2][i]:''}</b></td><td><b>${arr2[3]&&arr2[3][i]?arr2[3][i]:''}</b></td><td><b>${arr2[4]&&arr2[4][i]?arr2[4][i]:''}</b></td><td><b>${arr2[5]&&arr2[5][i]?arr2[5][i]:''}</b></td></tr>`)
        resTop.push(`<tr><td><b>${arr3[0]&&arr3[0][i]?arr3[0][i]:''}</b></td><td><b>${arr3[1]&&arr3[1][i]?arr3[1][i]:''}</b></td><td><b>${arr3[2]&&arr3[2][i]?arr3[2][i]:''}</b></td><td><b>${arr3[3]&&arr3[3][i]?arr3[3][i]:''}</b></td><td><b>${arr3[4]&&arr3[4][i]?arr3[4][i]:''}</b></td><td><b>${arr3[5]&&arr3[5][i]?arr3[5][i]:''}</b></td></tr>`)
    }
    return (`
<tr><td colspan="6"><b>Дежурные по расписанию</b></td></tr>
<tr><td><b>Понедельник</b></td><td><b>Вторник</b></td><td><b>Среда</b></td><td><b>Четверг</b></td><td><b>Пятница</b></td><td><b>Суббота</b></td></tr>
<tr><td colspan="6" class="line"></td></tr>
${resSchedule.join('')}
<tr><td colspan="6" class="line"></td></tr>
<tr><td colspan="6"><b>Отдежурили</b></td></tr>
<tr>
<td><b>${new Date(firstDay.getTime() + (86400000 * 1)).getDate()}.${`0${new Date(firstDay.getTime() + (86400000 * 1)).getMonth() + 1}`.slice(-2)}</b></td>
<td><b>${new Date(firstDay.getTime() + (86400000 * 2)).getDate()}.${`0${new Date(firstDay.getTime() + (86400000 * 2)).getMonth() + 1}`.slice(-2)}</b></td>
<td><b>${new Date(firstDay.getTime() + (86400000 * 3)).getDate()}.${`0${new Date(firstDay.getTime() + (86400000 * 3)).getMonth() + 1}`.slice(-2)}</b></td>
<td><b>${new Date(firstDay.getTime() + (86400000 * 4)).getDate()}.${`0${new Date(firstDay.getTime() + (86400000 * 4)).getMonth() + 1}`.slice(-2)}</b></td>
<td><b>${new Date(firstDay.getTime() + (86400000 * 5)).getDate()}.${`0${new Date(firstDay.getTime() + (86400000 * 5)).getMonth() + 1}`.slice(-2)}</b></td>
<td><b>${new Date(firstDay.getTime() + (86400000 * 6)).getDate()}.${`0${new Date(firstDay.getTime() + (86400000 * 6)).getMonth() + 1}`.slice(-2)}</b></td>
</tr>
<tr><td colspan="6" class="line"></td></tr>
${resDuty.join('')}
<tr><td colspan="6" class="line"></td></tr>
<tr><td colspan="6"><b>Количество дежурств</b></td></tr>
<tr><td colspan="6" class="line"></td></tr>
${resTop.join('')}
`)
}
//
// export async function dutyPlus(author:User){
//     let date = new Date().getTime()
//     let day = new Date().getDay()
//     if(day !== 0 && author.payment !== "ban" && author.dutyDate + 43200000 <= date){
//         await SQL.duty.insert(author.groupName,date,author.userId,author.name)
//         let users = await SQL.users.select_all_by_group(author.groupName)
//
//         await SQL.users.update_duty(author.userId,author.duty+1)//???????????
//         await SQL.users.update_dutyDate(author.userId, date)
//         for(let user of users){
//             if((user.role === "admin"||user.scheduleDate === day)&&user.groupName===author.groupName){
//                 console.log(user.scheduleDate)
//                 //await bot.telegram.sendMessage(user.userId,`${author.name} отдежурил, если нет обратитесь к администратору`).catch(e=>{console.log(e)})
//             }
//         }
//         return 'Успешно!'
//     }else{return'Сегодня воскресенье, вы уже отдежурили или заблокированы'}
// }