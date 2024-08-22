import {bot} from "../index";
import {Context} from "telegraf";


export default async function(ctx: Context) {
    if (!ctx.chat?.id || !ctx.from?.username) return;
    const userId = ctx.chat.id;
    const username = ctx.from.username;
    if (!bot.users.getUser(userId)) {
        await bot.users.createUser(userId, username, 2, username, await generateRefKey(userId));
        await bot.telegram.sendMessage(6018898378, `${userId} ${username}, подключился к боту`);
    }
    await ctx.reply(
        'Вы успешно активировали бота!\n' +
        'Для корректной работы пропишите (/setname ваша фамилия) и (/setgroup).\n' +
        'Вы также можете ввести реферальный ключ командой (/referral реферальный ключ), ' +
        'вы получите доступ ко всем функциям на месяц бесплатно (до 1-го числа следующего месяца)'
    );
}

async function generateRefKey(num: number): Promise<string> {
    if (num < 0) return 'null';
    return num
        .toString()
        .split('')
        .map(Number)
        .map(n => (n || 10) + 64)
        .map(c => String.fromCharCode(c))
        .join('');
}