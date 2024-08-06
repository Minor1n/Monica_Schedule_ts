import {Context} from "telegraf";
import {SQL} from "../sql";
import {Functions} from "../functions";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat?.id)
        if(user){
            await ctx.reply(`Настройки:`, {
                reply_markup: {
                    inline_keyboard: await Functions.callback_query.settings.keyboard(user)
                }
            })
        }else{await ctx.reply('Зарегистрируйтесь в боте /start')}
    }
}