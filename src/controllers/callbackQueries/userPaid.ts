import IContext from "@interfaces/IContext";
import ISceneSessionUserPaid from "@interfaces/scenes/ISceneSessionUserPaid";
import {bot} from "@index";
import {payments} from "@utils";

export default async(ctx: IContext<ISceneSessionUserPaid>, data: string) => {
    if (data.includes("undo")) {
        const usersKeyboard = await payments.generateUsersKeyboard();
        await ctx.editMessageText(`Изменить статус для:`, {
            reply_markup: {
                inline_keyboard: usersKeyboard,
            },
        });
        return;
    }
    const userId = Number(data.slice(8));
    const user = bot.users.getUser(userId);
    if (!user) {
        await ctx.reply('Пользователь не найден');
        return;
    }
    ctx.session.userId = user.info.id;
    ctx.session.status = user.payment.status;
    ctx.session.userName = user.info.name;
    ctx.session.messageId = ctx.callbackQuery!.message!.message_id;
    ctx.session.adminId = ctx.from!.id;
    await ctx.scene.enter('userPaid')
}