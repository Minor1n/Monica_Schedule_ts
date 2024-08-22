import {Context, Markup} from "telegraf";
import {bot} from "../index";
import {config} from "../config";
import userPaid from "./userPaid";
import payments from "../payments";

export default async(ctx: Context, data: string) => {
    const id = Number(data.split("_").pop());
    const user = bot.users.getUser(id);
    const vipOptions = [
        { label: "2мес", value: `vipStatus_3_${id}` },
        { label: "3мес", value: `vipStatus_4_${id}` },
        { label: "4мес", value: `vipStatus_5_${id}` },
        { label: "5мес", value: `vipStatus_6_${id}` },
        { label: "6мес", value: `vipStatus_7_${id}` },
        { label: "↩️", value: `userStatus_undo` },
    ]
    if (data.includes("vip")) {
        const vipKeyboard = vipOptions.map(option =>
            Markup.button.callback(option.label, option.value)
        );
        await ctx.editMessageText(`Уровень VIP:`, {
            reply_markup: {
                inline_keyboard: [vipKeyboard],
            },
        });
    } else if (data.includes("undo")) {
        const usersKeyboard = await payments.generateUsersKeyboard();
        await ctx.editMessageText(`Изменить статус для:`, {
            reply_markup: {
                inline_keyboard: usersKeyboard,
            },
        });
    } else if (user) {
        const status = data.slice(11).startsWith("f") ? -1 : Number(data.charAt(11));
        user.payment.status = status;
        user.payment.paid = "true";
        await userPaid(ctx, user);
        const message = status === 0 ? "Вы были заблокированы администратором" : config.paymentMessages.changeStatus(status);
        user.sendText(message);
    }else{
        await ctx.reply('Пользователь не найден')
    }
}