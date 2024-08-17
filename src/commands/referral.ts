import {Context} from "telegraf";
import {User} from "../classes";
import {config} from "../config";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        let {text} = ctx
        if(user){
            if(user.payment.paid === 'false'&&user.payment.referral.user){
                let refKey = text?.slice(10)
                if(refKey){
                    let agent = await new User().load(0,{refKey:refKey})
                    if(agent){
                        if(user.info.id  !== agent.info.id){
                            user.payment.status +=1
                            agent.payment.referral.insertReferral(user.info.id)
                            await ctx.reply(`Успешно активирован реферальный ключ!\nВаш статус изменен на ${config.payment.get(user.payment.status)}`)
                        }else{await ctx.reply('Вы не можете использовать свой же реферальный ключ')}
                    }else{ await ctx.reply(`Не найден реферальный агент для ключа: ${refKey}`) }
                }else{ await ctx.reply('Вы не указали реферальный ключ(/referral реферальный ключ)') }
            }else{ await ctx.reply('Вы уже активировали реферальный ключ, либо оплачивали подписку ранее')}
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}