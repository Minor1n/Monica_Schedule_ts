import {Context} from "telegraf";
import {bot} from "../index";
import {config} from "../config";

export default async(ctx: Context, data: string) => {
    const userId = ctx.from?.id;
    const dutyDay = parseInt(data.slice(10), 10);
    const dayNames = new Map<number, string>([
        [1, 'Понедельник'],
        [2, 'Вторник'],
        [3, 'Среда'],
        [4, 'Четверг'],
        [5, 'Пятница'],
        [6, 'Суббота'],
    ]);
    if (!userId)return;
    const user = bot.users.getUser(userId);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    user.duty.day = dutyDay;
    await ctx.editMessageText(`Установлен день: ${dayNames.get(dutyDay)}`);
}