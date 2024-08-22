import {Context} from "telegraf";
import {bot} from "../index";

export default async(ctx: Context, data: string) => {
    const userId = parseInt(data.slice(10), 10);
    const user = bot.users.getUser(userId);
    if (!user) {
        await ctx.reply('Пользователь не найден');
        return;
    }
    user.sendText(`Ошибка. Вы не оплатили подписку!`);
    const messageId = ctx.callbackQuery?.message?.message_id;
    const fromId = ctx.callbackQuery?.from.id;
    if (messageId && fromId) {
        await bot.telegram.deleteMessage(fromId, messageId);
    }
}