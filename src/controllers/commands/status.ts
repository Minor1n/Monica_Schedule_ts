import {Context} from "telegraf";
import {payments} from "@utils";
import type ICommand from "@interfaces/ICommand";

export default {
    name: "status",
    execute: async function (ctx:Context){
        if (ctx.chat?.id !== 6018898378) {
            await ctx.reply('Написано же ДЛЯ АДМИНОВ');
            return;
        }
        const usersKeyboard = await payments.generateUsersKeyboard();
        await ctx.reply('Изменить статус для:', {
            reply_markup: {
                inline_keyboard: usersKeyboard
            }
        });
    }
} satisfies ICommand;