import {Context} from "telegraf";
import {bot} from "../index";


export async function execute(ctx:Context){
    await ctx.reply('Не удаляйте это сообщение!', {
        reply_markup: {
            resize_keyboard: true,
            keyboard: [["Отдежурил"]]
        }
    })
}