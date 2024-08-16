import {Context} from "telegraf";
import {Functions} from "../functions";
import {User} from "../classes/User";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        if(user){
            await ctx.reply(`Настройки:`, {
                reply_markup: {
                    inline_keyboard: await Functions.callback_query.settings.keyboard(user)
                }
            })
        }else{await ctx.reply('Зарегистрируйтесь в боте /start')}
    }
}