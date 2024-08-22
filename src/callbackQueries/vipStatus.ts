import {Context} from "telegraf";
import {bot} from "../index";
import {config} from "../config";
import userPaid from "./userPaid";

export default async(ctx: Context, data: string) => {
    const parts = data.split("_");
    const status = parseInt(parts[1], 10);
    const id = parseInt(parts[2], 10);
    const user = bot.users.getUser(id);
    if (!user) {
        await ctx.reply('Пользователь не найден');
        return;
    }
    user.payment.status = status;
    user.payment.paid = "true";
    await userPaid(ctx, user);
    const statusMessage = config.paymentMessages.changeStatus(status);
    user.sendText(statusMessage);
}