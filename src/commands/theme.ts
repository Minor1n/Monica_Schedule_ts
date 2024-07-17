import {Context} from "telegraf";
import {bot} from "../index";
import {SQL} from "../sql";


export async function execute(ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat?.id)
        let {text}=ctx
        let theme = text?.slice(7)
        if(user.payment !== 'ban'){
            if(user&& theme && !theme.startsWith('monica_schedule_bot') && theme.match(/\.(jpeg|jpg|png)$/) != null){
                await SQL.users.update_theme(user.userId,theme)
                await ctx.reply(`Успешно установлена тема: ${theme}`)
            }else{await ctx.reply('Ошибка, возможно вы не зарегистрированы в боте, отсутствует ссылка на картинку, команда отправлена из группы или ссылка не ведет на картинку')}
        }else{await ctx.reply('Вы заблокированы администратором')}
    }
}