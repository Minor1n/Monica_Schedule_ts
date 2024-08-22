import {Context, Markup} from "telegraf";
import {User} from "../classes";
import {config} from "../config";

export default async(ctx: Context, user: User) => {
    const statusOptions = [
        { label: "true", value: `userStatus_2___${user.info.id}` },
        { label: "false", value: `userStatus_1___${user.info.id}` },
        { label: "free", value: `userStatus_f___${user.info.id}` },
        { label: "vip", value: `userStatus_vip_${user.info.id}` },
        { label: "ban", value: `userStatus_0___${user.info.id}` },
        { label: "↩️", value: "userStatus_undo" },
    ];
    const inlineKeyboard = statusOptions.map(option =>
        Markup.button.callback(option.label, option.value)
    );
    await ctx.editMessageText(`Текущий статус: ${config.payment.get(user.payment.status)}\nИзменить статус на:`,
        {
            reply_markup: {
                inline_keyboard: [inlineKeyboard],
            },
        }
    );
}