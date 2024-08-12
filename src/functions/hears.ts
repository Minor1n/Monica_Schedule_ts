import {Context} from "telegraf";
import {SQL} from "../sql";
import {bot} from "../index";


export async function duty(ctx:Context){
    if(ctx.chat?.id){
        let author = await SQL.users.select(ctx.chat.id)
        let date = new Date().getTime()
        let day = new Date().getDay()
        if(day !== 0 && author.payment !== 0 && author.dutyDate + 43200000 <= date){
            await SQL.duty.insert(author.groupName,date,author.userId,author.name)
            let users = await SQL.users.select_all_by_group(author.groupName)

            await SQL.users.update_duty(author.userId,author.duty+1)//???????????
            await SQL.users.update_dutyDate(author.userId, date)
            for(let user of users){
                if((user.role === "admin"||user.scheduleDate === day)&&user.groupName===author.groupName){
                    console.log(user.scheduleDate)
                    //await bot.telegram.sendMessage(user.userId,`${author.name} отдежурил, если нет обратитесь к администратору`).catch(e=>{console.log(e)})
                }
            }
            await ctx.reply('Успешно')
        }else{await bot.telegram.sendMessage(ctx.chat.id, 'Сегодня воскресенье, вы уже отдежурили или заблокированы').catch(e=>{console.log(e)});}
    }
}