import {Context} from "telegraf";
import {Replacements,HtmlToImage} from "../classes";
import {bot} from "../index";
import {config} from "../config";
import payments from "../payments";


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
    if (user.payment.status === 0) {
        await ctx.reply('Вы заблокированы');
        return;
    }
    const isGroupPaid = await payments.groupIsPaid(user);
    if (!isGroupPaid) {
        await ctx.reply('Не все участники группы оплатили подписку');
        return;
    }
    const replacements = await new Replacements().load();
    const replacement = replacements.getReplacement(0);
    if (!replacement) {
        await ctx.reply('Замены не найдены');
        return;
    }
    const htmlImg = user.settings.theme === "standard" ? bot.gradients.dark : `background-image: url(${user.settings.theme});`;
    const image = await new HtmlToImage(htmlImg, replacement.html).getImage();
    user.sendPhoto(image, 'schedule.png');
}