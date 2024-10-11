import {bot} from "@index";
import config from "@config";
import {Context} from "telegraf";
import IHear from "@interfaces/IHear";

export default {
    name: 'Отдежурил',
    execute: async(ctx: Context) => {
        const chatId = ctx.chat?.id;
        if (!chatId) return;
        try {
            const author = bot.users.getUser(chatId)
            const currentDate = Date.now();
            const currentDay = new Date().getDay();
            if (!author) {
                await ctx.reply(config.notfoundMessages.user);
                return;
            }
            if (currentDay !== 0 && author.payment.status !== 0 && (author.duty.lastDate + 43200000 <= currentDate)) {
                const group = bot.groups.getGroup(author.info.groupName);
                if(!group) {
                    await ctx.reply(config.notfoundMessages.group);
                    return
                }
                group.duty.insertDuty(currentDate, author.info.id, author.info.name);
                author.duty.count += 1;
                author.duty.lastDate = currentDate;
                const adminOrDutyUsers = group.users.filter(user => (user.info.role === "admin" || user.duty.day === currentDay) && user.info.groupName === author.info.groupName);
                for (const user of adminOrDutyUsers) {
                    user.sendText(`${author.info.name} отдежурил, если нет обратитесь к администратору`);
                }
                await ctx.reply('Успешно');
            } else {
                await ctx.reply('Сегодня воскресенье, вы уже отдежурили или заблокированы');
            }
        } catch (error) {
            console.log(`Error processing duty: ${error}`);
            await bot.telegram.sendMessage(chatId, 'Произошла ошибка при обработке вашего запроса.');
        }
    }
} satisfies IHear