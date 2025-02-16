import {Scenes} from "telegraf";
import IContext from "@interfaces/IContext";
import {bot} from "@index";
import ISceneSessionSetTheme from "@interfaces/scenes/ISceneSessionSetTheme";


export default new Scenes.BaseScene<IContext<ISceneSessionSetTheme>>('setTheme')
    .enter(async ctx => {
        await ctx.reply('Укажите ссылку на изображение:')
    })
    .on('text', ctx => {
        const url = ctx.message?.text;
        const user = bot.users.getUser(ctx.session.userId);

        if (url && user) {
            user.settings.theme = url;
            ctx.reply(`Успешно установлена тема: ${user.settings.theme}`);
            ctx.scene.leave();
        } else {
            ctx.reply('Ошибка,отсутствует ссылка на картинку')
            ctx.scene.leave();
        }
    });