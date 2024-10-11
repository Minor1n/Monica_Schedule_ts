import {bot} from "@index";
import {callbackQueries} from "@controllers";

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
        }else if (data.startsWith('fetch')){
            if(data.startsWith('fetchSchedules')){
                await callbackQueries.fetch.schedule(data, ctx.from.id)
                await ctx.deleteMessage()
            }else if(data.startsWith('fetchReplacements')){
                await callbackQueries.fetch.replacement(data, ctx.from.id)
                await ctx.deleteMessage()
            }
        }
    });
};