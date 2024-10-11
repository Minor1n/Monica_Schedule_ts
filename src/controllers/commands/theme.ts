import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";
import ICommand from "@interfaces/ICommand";

export default {
    name: "theme",
    execute: async function(ctx:Context){
        if (!ctx.chat?.id) return;
        const user = bot.users.getUser(ctx.chat.id);
        if (!user) {
            await ctx.reply(config.notfoundMessages.user);
            return;
        }
        if (user.payment.status === 0) {
            await ctx.reply('Вы заблокированы администратором');
            return;
        }
        const theme = ctx.text?.slice(7);
        if (!theme || theme.startsWith('monica_schedule_bot')) {
            await ctx.reply('Ошибка,отсутствует ссылка на картинку, команда отправлена из группы или ссылка не ведет на картинку');
            return;
        }
        user.settings.theme = theme;
        await ctx.reply(`Успешно установлена тема: ${user.settings.theme}`);
    }
} satisfies ICommand;