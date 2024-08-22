import {Context} from "telegraf";
import {bot} from "../index";
import {config} from "../config";


export default async function(ctx:Context){
    const chatId = ctx.chat?.id;
    if (!chatId) {
        await ctx.reply('Ошибка: чат не найден');
        return;
    }
    const user = bot.users.getUser(chatId)
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    if (user.info.id <= 0) {
        await ctx.reply('Ошибка. Команда отправлена из группы');
        return;
    }
    const message = `${user.info.name}(${user.info.id}) оповестил об оплате, статус: ${config.payment.get(user.payment.status)}`;
    const replyMarkup = {
        inline_keyboard: [[
            { text: 'Не оплачено', callback_data: `paidStatus${user.info.id}` },
            { text: 'Оплачено', callback_data: `userPaid${user.info.id}` }
        ]]
    };

    await bot.telegram.sendMessage(6018898378, message, { reply_markup: replyMarkup });
    await ctx.reply('Запрос на проверку оплаты отправлен, ожидайте');
}