import {Scenes} from "telegraf";
import IContext from "@interfaces/IContext";
import ISceneSessionSetName from "@interfaces/scenes/ISceneSessionSetName";
import {bot} from "@index";


export default new Scenes.BaseScene<IContext<ISceneSessionSetName>>('setName')
    .enter(async ctx => {
        await ctx.reply('Введите имя:')
    })
    .on('text', ctx => {
        const name = ctx.message?.text;
        const user = bot.users.getUser(ctx.session.userId);

        if (name && user) {
            user.info.name = name;
            ctx.reply(`Вы установили имя: ${name}`);
            ctx.scene.leave();
        } else {
            ctx.reply('Ошибка')
            ctx.scene.leave();
        }
    });