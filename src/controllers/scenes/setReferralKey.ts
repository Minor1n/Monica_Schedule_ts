import {Scenes} from "telegraf";
import IContext from "@interfaces/IContext";
import ISceneSessionSetTheme from "@interfaces/scenes/ISceneSessionSetTheme";
import {bot} from "@index";
import {payments} from "@utils";

export default new Scenes.BaseScene<IContext<ISceneSessionSetTheme>>('setReferralKey')
    .enter(async ctx => {
        await ctx.reply('Укажите реферальный ключ друга:')
    })
    .on('text', async ctx => {
        const refKey = ctx.message?.text;
        const user = bot.users.getUser(ctx.session.userId);

        if (refKey && user) {
            const responseMessage = await payments.setReferralKey(user, refKey);
            await ctx.reply(responseMessage);
            await ctx.scene.leave();
        } else {
            await ctx.reply('Ошибка,отсутствует реферальный ключ')
            await ctx.scene.leave();
        }
    });