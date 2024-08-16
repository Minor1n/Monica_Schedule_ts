import {Context} from "telegraf";
import {User} from "../classes/User";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        let {text} = ctx
        if(user){
            if(user.payment.referral.status === 'false'){
                let refKey = text?.slice(10)
                if(refKey){
                    let agent = await new User().load(0,{refKey:refKey})
                    if(agent){
                        if(user.info.id  !== agent.info.id){
                            user.payment.referral.status = 'true'
                            user.payment.status = 3
                            agent.payment.referral.insertReferral(user.info.id)
                            agent.payment.referral.agentsApprove +=1
                            await ctx.reply('Успешно активирован реферальный ключ!\nВы получили доступ ко всем функциям на 2 месяца (до 1-го числа 2-го месяца)')
                        }else{await ctx.reply('Вы не можете использовать свой же реферальный ключ')}
                    }else{ await ctx.reply(`Не найден реферальный агент для ключа: ${refKey}`) }
                }else{ await ctx.reply('Вы не указали реферальный ключ(/referral реферальный ключ)') }
            }else{ await ctx.reply('Вы уже активировали реферальный ключ, либо оплачивали подписку ранее')}
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}