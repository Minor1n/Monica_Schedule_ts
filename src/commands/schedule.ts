import {Context} from "telegraf";
import {HtmlToImage} from "../classes";
import {bot} from "../index";
import {config} from "../config";
import payments from "../payments";


export default async function(ctx:Context){
    const chatId = ctx.chat?.id;
    if (!chatId) {
        return;
    }
    const user = bot.users.getUser(chatId);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    if (user.payment.status === 0) {
        await ctx.reply('Вы заблокированы');
        return;
    }
    const group = bot.groups.getGroup(user.info.groupName);
    if (user.info.groupName === 'null' || !group) {
        await ctx.reply(config.notfoundMessages.group);
        return;
    }
    const html = group.schedule.html;
    if (html === 'null') {
        await ctx.reply('Расписание еще не было сгенерировано');
        return;
    }
    const isGroupPaid = await payments.groupIsPaid(user);
    if (!isGroupPaid) {
        await ctx.reply('Не все участники группы оплатили подписку');
        return;
    }
    const htmlImg = user.settings.theme === "standard" ? bot.gradients.light : `background-image: url(${user.settings.theme});`;
    const image = await new HtmlToImage(htmlImg, html).getImage();
    user.sendPhoto(image, 'schedule.png');
}