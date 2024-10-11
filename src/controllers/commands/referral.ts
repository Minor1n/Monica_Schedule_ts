import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";
import {payments} from "@utils";
import ICommand from "@interfaces/ICommand";

export default {
    name: "referral",
    execute: async function(ctx:Context){
        const chatId = ctx.chat?.id;
        const refKey = ctx.text?.slice(10).trim();
        if (!chatId) {
            return;
        }
        const user = bot.users.getUser(chatId)
        if (!user) {
            await ctx.reply(config.notfoundMessages.user);
            return;
        }
        if (!refKey) {
            await ctx.reply('Вы не указали реферальный ключ(/referral реферальный ключ)');
            return;
        }
        const responseMessage = await payments.setReferralKey(user, refKey);
        await ctx.reply(responseMessage);
    }
} satisfies ICommand;