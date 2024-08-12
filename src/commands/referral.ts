import {Context} from "telegraf";
import {SQL} from "../sql";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat.id)
        let {text} = ctx
        if(user){
            if(user.refKeyStatus === 'false'){
                let refKey = text?.slice(10)
                if(refKey){
                    let agent = await SQL.users.select_refAgents_by_refKey(refKey)
                    if(agent){
                        if(user.userId  !==  agent.userId){
                            await SQL.users.update_refKeyStatus(user.userId,'true')
                            await SQL.users.update_payment(user.userId,3)
                            await SQL.users.update_refAgents(agent.userId,agent.refAgents+1)
                            await SQL.referral.insert(agent.userId,user.userId,refKey)
                            await ctx.reply('Успешно активирован реферальный ключ!\nВы получили доступ ко всем функциям на 2 месяца (до 1-го числа 2-го месяца)')
                        }else{await ctx.reply('Вы не можете использовать свой же реферальный ключ')}
                    }else{ await ctx.reply(`Не найден реферальный агент для ключа: ${refKey}`) }
                }else{ await ctx.reply('Вы не указали реферальный ключ(/referral реферальный ключ)') }
            }else{ await ctx.reply('Вы уже активировали реферальный ключ, либо оплачивали подписку ранее')}
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}