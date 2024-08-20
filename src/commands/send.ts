import {Context} from "telegraf";
import {users} from "../index";


export default async function(ctx:Context){
    const chatId = ctx.chat?.id;
    let text = ctx.text?.slice(6).trim();
    if (chatId !== 6018898378 || !text || text.startsWith('monica_schedule_bot')) {
        await ctx.reply('Написано же ДЛЯ АДМИНОВ');
        return;
    }
    users.sendText(text)
}