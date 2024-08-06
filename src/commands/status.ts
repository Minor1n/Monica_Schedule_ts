import {Context} from "telegraf";
import {Functions} from "../functions";


export default async function (ctx:Context){
    if(ctx.chat?.id === 6018898378){
        let usersKeyboard = await Functions.payment.paid()
        await ctx.reply(`Изменить статус для:`, {
            reply_markup: {
                inline_keyboard: usersKeyboard
            }
        })
    }else{await ctx.reply('Написано же ДЛЯ АДМИНОВ')}
}