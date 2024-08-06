import {Context} from "telegraf";
import {bot} from "../index";
import {SQL} from "../sql";
import {Functions} from "../functions";


export default async function(id:number,ctx?:Context){
    if(id === 6018898378){
        let dates=[]
        let scheduleLink = (await SQL.settings.select('scheduleLink')).value
        let replacementLink = (await SQL.settings.select('replacementLink')).value
        let response = await (await fetch('http://rgkript.ru/raspisanie-zanyatiy/')).text()
        let re = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+new Date().getFullYear()+'[0-9/.\\-A-Za-z_]+"','g')
        let links = Array.from(new Set(response.match(re))).map(x=>x.slice(9,-1))
        let dateArr = response.match(/<strong>[А-Яа-я0-9. ]+/g)
        if(dateArr)
        for(let i of dateArr){
            let t = i.match(/[0-9]+.[0-9]+.[0-9]+/g)
            if(t){dates.push(i[0])}
        }
        if(links[0]!==scheduleLink){
            await SQL.settings.update_value(links[0],'scheduleLink')
            await bot.telegram.sendMessage(id,`Расписание: ${dates[0]} ${links[0].slice(36)}`)
                .then(r=>{setTimeout(()=>{bot.telegram.deleteMessage(r.chat.id,r.message_id).catch(e=>{console.log(e)})},1000*30)})
                .catch(e=>{console.log(e)})
            await Functions.schedule.regenerate(links[0],dates[0]).then(async schedule=>{
                await Functions.schedule.sender(schedule)
            })
        }else{
            await bot.telegram.sendMessage(id,`Расписание не найдено`)
                .then(r=>{setTimeout(()=>{bot.telegram.deleteMessage(r.chat.id,r.message_id).catch(e=>{console.log(e)})},1000*30)})
                .catch(e=>{console.log(e)})
        }
        if(links[1]!==replacementLink){
            await SQL.settings.update_value(links[1],'replacementLink')
            await bot.telegram.sendMessage(id,`Замены: ${dates[1]} ${links[1].slice(36)}`)
                .then(r=>{setTimeout(()=>{bot.telegram.deleteMessage(r.chat.id,r.message_id).catch(e=>{console.log(e)})},1000*30)})
                .catch(e=>{console.log(e)})
            await Functions.replacement.regenerate(links[1],dates[1]).then(async replacement=>{
                await Functions.replacement.sender(replacement)
            })
        }else{
            await bot.telegram.sendMessage(id,`Замены не найдены`)
                .then(r=>{setTimeout(()=>{bot.telegram.deleteMessage(r.chat.id,r.message_id).catch(e=>{console.log(e)})},1000*30)})
                .catch(e=>{console.log(e)})
        }
    }else{ // @ts-ignore
        await ctx.reply('Написано же ДЛЯ АДМИНОВ')}
}