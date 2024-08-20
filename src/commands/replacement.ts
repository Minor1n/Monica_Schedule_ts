import {Context} from "telegraf";
import {Functions} from "../functions";
import {Replacements,HtmlToImage} from "../classes";
import {gradients,users} from "../index";
import {config} from "../config";


export default async function(ctx:Context){
    const chatId = ctx.chat?.id;
    if (!chatId) {
        return;
    }
    const user = users.getUser(chatId)
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    if (user.payment.status === 0) {
        await ctx.reply('Вы заблокированы');
        return;
    }
    const isGroupPaid = await Functions.payment.groupTG(user);
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
    const htmlImg = user.settings.theme === "standard" ? gradients.dark : `background-image: url(${user.settings.theme});`;
    const image = await new HtmlToImage(htmlImg, replacement.html).getImage();
    user.sendPhoto(image, 'schedule.png');
}