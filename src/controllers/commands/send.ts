import {Context} from "telegraf";
import {bot} from "@index";
import ICommand from "@interfaces/ICommand";

export default {
    name: "send",
    execute: async function(ctx:Context){
        const chatId = ctx.chat?.id;
        let text = ctx.text?.slice(6).trim();
        if (chatId !== 6018898378 || !text || text.startsWith('monica_schedule_bot')) {
            await ctx.reply('Написано же ДЛЯ АДМИНОВ');
            return;
        }
        bot.users.sendText(text)
    }
} satisfies ICommand;