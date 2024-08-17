import {Context} from "telegraf";
import {bot} from "../index";
import {User,Group} from "../classes";


export async function duty(ctx:Context){
    if(ctx.chat?.id){
        let author = await new User().load(ctx.chat.id)
        let date = new Date().getTime()
        let day = new Date().getDay()
        if(day !== 0 && author.payment.status !== 0 && author.duty.lastDate + 43200000 <= date){
            let group = await new Group().load(author.info.groupName)
            group.insertDuty(date,author.info.id,author.info.name)
            let users = group.users
            author.duty.count +=1
            author.duty.lastDate = date
            for(let user of users){
                if((user.info.role === "admin"||user.duty.day === day)&&user.info.groupName===author.info.groupName){
                    console.log(user.duty.day)
                    //await bot.telegram.sendMessage(user.userId,`${author.name} отдежурил, если нет обратитесь к администратору`).catch(e=>{console.log(e)})
                }
            }
            await ctx.reply('Успешно')
        }else{await bot.telegram.sendMessage(ctx.chat.id, 'Сегодня воскресенье, вы уже отдежурили или заблокированы').catch(e=>{console.log(e)});}
    }
}