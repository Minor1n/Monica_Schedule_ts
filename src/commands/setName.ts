import {Context} from "telegraf";
import {User} from "../classes";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        let {text}=ctx
        if(user){
            let surname = text?.slice(9)
            if(surname){
                user.info.name = surname
                await ctx.reply(`Ваше имя - ${surname}`)
            }else{ await ctx.reply('Вы не указали имя(/setname ваше имя)') }
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}