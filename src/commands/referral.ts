import {Context} from "telegraf";
import {Functions} from "../functions";
import {users} from "../index";
import {config} from "../config";


export default async function(ctx:Context){
    const chatId = ctx.chat?.id;
    const refKey = ctx.text?.slice(10).trim();
    if (!chatId) {
        return;
    }
    const user = users.getUser(chatId)
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    if (!refKey) {
        await ctx.reply('Вы не указали реферальный ключ(/referral реферальный ключ)');
        return;
    }
    const responseMessage = await Functions.payment.setRefKey(user, refKey);
    await ctx.reply(responseMessage);
}