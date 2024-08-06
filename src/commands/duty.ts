import {Context} from "telegraf";


export default async function(ctx:Context){
    await ctx.reply('Не удаляйте это сообщение!', {
        reply_markup: {
            resize_keyboard: true,
            keyboard: [["Отдежурил"]]
        }
    })
}