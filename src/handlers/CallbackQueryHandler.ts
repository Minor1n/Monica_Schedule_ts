import {bot} from "../index";
import callbackQueries from "../callbackQueries";

export default () => {
    bot.on('callback_query', async (ctx) => {
        // @ts-ignore
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        if (data.startsWith('userPaid')) {
            const userId = Number(data.slice(8));
            const user = bot.users.getUser(userId);
            if (!user) {
                await ctx.reply('Пользователь не найден');
                return;
            }
            await callbackQueries.userPaid(ctx, user);
        }
        else if (data.startsWith('paidStatus')) {
            await callbackQueries.paidStatus(ctx,data);
        }
        else if (data.startsWith('userStatus')) {
            await callbackQueries.userStatus(ctx,data);
        }
        else if (data.startsWith('vipStatus')) {
            await callbackQueries.vipStatus(ctx,data);
        }
        else if (data.startsWith('settings')) {
            await callbackQueries.settings.updateSettings(ctx, data, data.slice(8).toLowerCase().replace(/[0-9]+/g,''))
        }
        else if (data.startsWith('setGroup')) {
            await callbackQueries.setGroup(ctx,data);
        }
        else if (data.startsWith('setDutyDay')) {
            await callbackQueries.setDutyDay(ctx,data);
        }
    });
};