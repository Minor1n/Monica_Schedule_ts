import {Context} from "telegraf";
import ICommand from "@interfaces/ICommand";

export default {
    name: "duty",
    execute: async function(ctx:Context){
        await ctx.reply('Не удаляйте это сообщение!', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: [["Отдежурил"]]
            }
        })
    }
} satisfies ICommand;