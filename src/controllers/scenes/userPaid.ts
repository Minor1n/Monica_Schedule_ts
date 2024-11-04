import {Markup, Scenes} from "telegraf";
import config from "@config";
import IContext from "@interfaces/IContext";
import ISceneSessionUserPaid from "@interfaces/ISceneSessionUserPaid";
import {bot} from "@index";
import {ExtraEditMessageText} from "telegraf/typings/telegram-types";

const edit = (ctx:IContext<ISceneSessionUserPaid>, message:string, extra?: ExtraEditMessageText) => {
    bot.telegram.editMessageText(ctx.session.adminId,ctx.session.messageId,undefined,message,extra);
}

export default new Scenes.BaseScene<IContext<ISceneSessionUserPaid>>('userPaid')
    .enter(ctx => {
        edit(ctx,`Пользователь: ${ctx.session.userName}(${ctx.session.userId})\nТекущий статус: ${config.payment.get(ctx.session.status)}\nИзменить статус на:`,{
            reply_markup:{
                inline_keyboard:[[
                    Markup.button.callback("↩️",`userPaid_undo`)
                ]]
            }
        })
    })
    .on('text', ctx => {
        const status = ctx.message?.text;
        const user = bot.users.getUser(ctx.session.userId);

        if (status && user) {
            user.payment.status += Number(status)
            user.payment.paid = "true";
            edit(ctx,`Статус оплаты пользователя ${user.info.userName}(${user.info.id}) изменен на ${config.payment.get(user.payment.status)}`,{
                reply_markup:{
                    inline_keyboard:[[
                        Markup.button.callback("↩️",`userPaid_undo`)
                    ]]
                }
            })
            user.sendText(user.payment.status === 0 ? "Вы были заблокированы администратором" : config.paymentMessages.changeStatus(user.payment.status))
            ctx.scene.leave();
        } else {
            ctx.reply('Ошибка')
            ctx.scene.leave();
        }
    });