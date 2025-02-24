import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";
import {callbackQueries} from "@controllers";
import ICommand from "@interfaces/ICommand";

export default {
    name: "settings",
    execute: async function(ctx:Context){
        if (!ctx.chat?.id) return;
        const user = bot.users.getUser(ctx.chat.id);
        if (!user) {
            await ctx.reply(config.notfoundMessages.user);
            return;
        }
        const keyboard = await callbackQueries.settings.keyboard(user);
        await ctx.reply('Настройки:', {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    }
} satisfies ICommand;