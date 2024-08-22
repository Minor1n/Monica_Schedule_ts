import {Context} from "telegraf";
import {config} from "../config";
import {bot} from "../index";


export default async function(ctx:Context){
    const chatId = ctx.chat?.id;
    if (!chatId) {
        return;
    }
    const user = bot.users.getUser(chatId)
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    const { groupName, id, name } = user.info;
    const refKey = user.payment.referral.key;
    const refBonus = config.paymentMessages.refBonus(user.info.id, user.payment.referral.agentsApprove);
    const paymentStatus = config.payment.get(user.payment.status);
    const priceWithBonus = Math.floor(user.payment.price - (user.payment.price * (refBonus / 100)));
    const message = `
        Группа: <b>${groupName}</b>
        Id: 🔗<code>${id}</code>
        Фамилия: <b>${name}</b>
        Статус оплаты: <b>${paymentStatus}</b>
        Сумма оплаты с учетом рефералки: <b>${priceWithBonus}</b>
        Реферальный ключ: 🔗<code>${refKey}</code>
        Бонус рефералов: <b>${refBonus}%</b>
        Связь с админом: @a_korop
    `.replace(/\n +/g,'\n')
    await ctx.reply(message, { parse_mode: 'HTML' });
}