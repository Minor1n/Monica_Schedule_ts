import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";
import keyboard from "./keyboard";
import {UserSettingsType} from "@types";

export default async (ctx: Context, data: string, settingType: UserSettingsType) => {
    const userId = Number(data.replace(/^\D+/g, ''));
    const user = bot.users.getUser(userId);
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
        case 'groupReplacement'.toLowerCase():
            user.settings.switchGroupReplacement();
            break;
    }
    await ctx.editMessageText('Настройки:', {
        reply_markup: {
            inline_keyboard: await keyboard(user),
        },
    });
}