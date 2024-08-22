import {Context} from "telegraf";
import {bot} from "../index";
import {config} from "../config";


export default async function(ctx:Context){
    if (!ctx.chat?.id) return;
    const user = bot.users.getUser(ctx.chat.id);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    const surname = ctx.text?.slice(9);
    if (surname) {
        user.info.name = surname;
        await ctx.reply(`Ваше имя - ${surname}`);
    } else {
        await ctx.reply('Вы не указали имя (/setname ваше имя)');
    }
}