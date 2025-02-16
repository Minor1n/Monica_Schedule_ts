import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";
import HtmlToImage from "@classes/HtmlToImage";
import {payments} from "@utils";
import type ICommand from "@interfaces/ICommand";

export default {
    name: "replacement",
    execute: async function(ctx:Context){
        const chatId = ctx.chat?.id;
        if (!chatId) {
            return;
        }
        const user = bot.users.getUser(chatId)
        if (!user) {
            await ctx.reply(config.notfoundMessages.user);
            return;
        }
        if (user.payment.status === 0) {
            await ctx.reply('Вы заблокированы');
            return;
        }
        const isGroupPaid = await payments.groupIsPaid(user);
        if (!isGroupPaid) {
            await ctx.reply('Не все участники группы оплатили подписку');
            return;
        }
        const replacement = bot.replacements.getReplacement(0);
        if (!replacement) {
            await ctx.reply('Замены не найдены');
            return;
        }
        const htmlImg = user.settings.theme === "standard" ? bot.gradients.dark : `background-image: url(${user.settings.theme});`;
        const image = await new HtmlToImage(htmlImg, replacement.html).getImage();
        user.sendPhoto(image, 'schedule.png');
    }
} satisfies ICommand;