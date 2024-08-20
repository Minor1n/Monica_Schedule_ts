import {bot,users} from "../index";
import {Functions} from "../functions";

export const FunctionsHandler = () => {
    bot.hears("Отдежурил", async (ctx) => {
        await Functions.hears.duty(ctx);
    });

    bot.on('callback_query', async (ctx) => {
        // @ts-ignore
        const data = ctx.callbackQuery?.data;
        if (!data) return;

        if (data.startsWith('userPaid')) {
            const userId = Number(data.slice(8));
            const user = users.getUser(userId);
            if (!user) {
                await ctx.reply('Пользователь не найден');
                return;
            }
            await Functions.callback_query.userPaid(ctx, user);
        }
        else if (data.startsWith('paidStatus')) {
            await Functions.callback_query.paidStatus(ctx,data);
        }
        else if (data.startsWith('userStatus')) {
            await Functions.callback_query.userStatus(ctx,data);
        }
        else if (data.startsWith('vipStatus')) {
            await Functions.callback_query.vipStatus(ctx,data);
        }
        else if (data.startsWith('settings')) {
            await handleSettings(ctx, data);
        }
        else if (data.startsWith('setGroup')) {
            await Functions.callback_query.setGroup(ctx,data);
        }
        else if (data.startsWith('setDutyDay')) {
            await Functions.callback_query.setDutyDay(ctx,data);
        }
    });
};
const handleSettings = async (ctx: any, data: string) => {
    if (data.startsWith('settingsSchedule')) {
        await Functions.callback_query.settings.schedule(ctx,data);
    }
    else if (data.startsWith('settingsReplacement')) {
        await Functions.callback_query.settings.replacement(ctx,data);
    }
    else if (data.startsWith('settingsDuty')) {
        await Functions.callback_query.settings.duty(ctx,data);
    }
};