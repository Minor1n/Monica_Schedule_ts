import {Context} from "telegraf";
import {bot} from "../index";
import {Functions} from "../functions";
import {Users} from "../classes";


export default async function(ctx:Context){
    let {text} = ctx
    text = text?.slice(6)
    if(ctx.chat?.id === 6018898378 && text && !text.startsWith('monica_schedule_bot')){
        let users = await new Users().load()
        for(let user of users.all){
            if(user.payment.status !== 0){
                await bot.telegram.sendMessage(user.info.id,text).catch(e=>{console.log(e)})
                await Functions.payment.alert(user)
            }
        }
    }else{await ctx.reply('Написано же ДЛЯ АДМИНОВ')}
}