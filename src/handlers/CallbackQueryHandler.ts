import {bot} from "@index";
import {callbackQueries} from "@controllers";
import {UserSettingsType} from "@types";

export default () => {
    bot.on('callback_query', async (ctx) => {
        // @ts-ignore
        const data:string = ctx.callbackQuery?.data;
        if (!data) return;

        if (data.startsWith('userPaid')) {
            await callbackQueries.userPaid(ctx, data);
        }
        else if (data.startsWith('paidStatus')) {
            await callbackQueries.paidStatus(ctx,data);
        }
        else if (data.startsWith('settings')) {
            await callbackQueries.settings.updateSettings(ctx, data, <UserSettingsType>data.slice(8).toLowerCase().replace(/[0-9]+/g,''))
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