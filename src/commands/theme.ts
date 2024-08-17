import {Context} from "telegraf";
import {User} from "../classes";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        let {text}=ctx
        let theme = text?.slice(7)
        if(user.payment.status !== 0){
            if(user&& theme && !theme.startsWith('monica_schedule_bot')){
                user.settings.theme = theme
                await ctx.reply(`Успешно установлена тема: ${user.settings.theme}`)
            }else{await ctx.reply('Ошибка, возможно вы не зарегистрированы в боте, отсутствует ссылка на картинку, команда отправлена из группы или ссылка не ведет на картинку')}
        }else{await ctx.reply('Вы заблокированы администратором')}
    }
}