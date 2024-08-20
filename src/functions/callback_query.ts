import {Context, Markup} from "telegraf";
import {Functions} from "./index";
import {bot,users} from "../index";
import {config} from "../config";
import {User} from "../classes";


export async function userPaid(ctx: Context, user: User) {
    const statusOptions = [
        { label: "true", value: `userStatus_2___${user.info.id}` },
        { label: "false", value: `userStatus_1___${user.info.id}` },
        { label: "free", value: `userStatus_f___${user.info.id}` },
        { label: "vip", value: `userStatus_vip_${user.info.id}` },
        { label: "ban", value: `userStatus_0___${user.info.id}` },
        { label: "↩️", value: "userStatus_undo" },
    ];
    const inlineKeyboard = statusOptions.map(option =>
        Markup.button.callback(option.label, option.value)
    );
    await ctx.editMessageText(`Текущий статус: ${config.payment.get(user.payment.status)}\nИзменить статус на:`,
        {
            reply_markup: {
                inline_keyboard: [inlineKeyboard],
            },
        }
    );
}

export async function userStatus(ctx: Context, data: string) {
    const id = Number(data.split("_").pop());
    const user = users.getUser(id);
    const vipOptions = [
        { label: "2мес", value: `vipStatus_3_${id}` },
        { label: "3мес", value: `vipStatus_4_${id}` },
        { label: "4мес", value: `vipStatus_5_${id}` },
        { label: "5мес", value: `vipStatus_6_${id}` },
        { label: "6мес", value: `vipStatus_7_${id}` },
        { label: "↩️", value: `userStatus_undo` },
    ]
    if (data.includes("vip")) {
        const vipKeyboard = vipOptions.map(option =>
            Markup.button.callback(option.label, option.value)
        );
        await ctx.editMessageText(`Уровень VIP:`, {
            reply_markup: {
                inline_keyboard: [vipKeyboard],
            },
        });
    } else if (data.includes("undo")) {
        const usersKeyboard = await Functions.payment.paid();
        await ctx.editMessageText(`Изменить статус для:`, {
            reply_markup: {
                inline_keyboard: usersKeyboard,
            },
        });
    } else if (user) {
        const status = data.slice(11).startsWith("f") ? -1 : Number(data.charAt(11));
        user.payment.status = status;
        user.payment.paid = "true";
        await Functions.callback_query.userPaid(ctx, user);
        const message = status === 0 ? "Вы были заблокированы администратором" : config.paymentMessages.changeStatus(status);
        user.sendText(message);
    }else{
        await ctx.reply('Пользователь не найден')
    }
}

export async function vipStatus(ctx: Context, data: string) {
    const parts = data.split("_");
    const status = parseInt(parts[1], 10);
    const id = parseInt(parts[2], 10);
    const user = users.getUser(id);
    if (!user) {
        await ctx.reply('Пользователь не найден');
        return;
    }
    user.payment.status = status;
    user.payment.paid = "true";
    await Functions.callback_query.userPaid(ctx, user);
    const statusMessage = config.paymentMessages.changeStatus(status);
    user.sendText(statusMessage);
}


export async function setGroup(ctx: Context, data: string) {
    const userId = ctx.from?.id;
    const groupName = data.slice(8);
    if(!userId)return;
    const user = users.getUser(userId);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    user.info.groupName = groupName;
    await ctx.editMessageText(`Установлена группа: ${groupName}`);
}

export async function paidStatus(ctx: Context, data: string) {
    const userId = parseInt(data.slice(10), 10);
    const user = users.getUser(userId);
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

export async function setDutyDay(ctx: Context, data: string) {
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
    const user = users.getUser(userId);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    user.duty.day = dutyDay;
    await ctx.editMessageText(`Установлен день: ${dayNames.get(dutyDay)}`);
}

export const settings = {
    keyboard: async (user: User) => {
        return [
            [
                Markup.button.callback(`Дежурства: ${user.settings.duty}`, `settingsDuty${user.info.id}`),
                Markup.button.callback(`Расписание: ${user.settings.schedule}`, `settingsSchedule${user.info.id}`),
                Markup.button.callback(`Замены: ${user.settings.replacement}`, `settingsReplacement${user.info.id}`)
            ]
        ];
    },

    updateSettings: async (ctx: Context, data: string, settingType: 'duty' | 'schedule' | 'replacement') => {
        const userId = Number(data.replace(/^\D+/g, ''));
        const user = users.getUser(userId);
        if (!user) {
            await ctx.reply(config.notfoundMessages.user);
            return;
        }
        switch (settingType) {
            case 'duty':
                user.settings.switchDuty();
                break;
            case 'schedule':
                user.settings.switchSchedule();
                break;
            case 'replacement':
                user.settings.switchReplacement();
                break;
        }
        await ctx.editMessageText('Настройки:', {
            reply_markup: {
                inline_keyboard: await settings.keyboard(user),
            },
        });
    },

    schedule: async (ctx: Context, data: string) => {
        await settings.updateSettings(ctx, data, 'schedule');
    },

    replacement: async (ctx: Context, data: string) => {
        await settings.updateSettings(ctx, data, 'replacement');
    },

    duty: async (ctx: Context, data: string) => {
        await settings.updateSettings(ctx, data, 'duty');
    },
};