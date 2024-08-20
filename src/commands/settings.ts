import {Context} from "telegraf";
import {Functions} from "../functions";
import {users} from "../index";
import {config} from "../config";


export default async function(ctx:Context){
    if (!ctx.chat?.id) return;
    const user = users.getUser(ctx.chat.id);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    const keyboard = await Functions.callback_query.settings.keyboard(user);
    await ctx.reply('Настройки:', {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
}