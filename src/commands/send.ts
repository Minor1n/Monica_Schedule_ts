import {Context} from "telegraf";
import {bot} from "../index";
import {SQL} from "../sql";
import {Functions} from "../functions";


export default async function(ctx:Context){
    let {text} = ctx
    text = text?.slice(6)
    if(ctx.chat?.id === 6018898378 && text && !text.startsWith('monica_schedule_bot')){
        let users = await SQL.users.select_all()
        for(let user of users){
            if(user.payment !== "ban"){
                await bot.telegram.sendMessage(user.userId,text).catch(e=>{console.log(e)})
                await Functions.payment.alert(user)
            }
        }
    }else{await ctx.reply('Написано же ДЛЯ АДМИНОВ')}
}