import {Context} from "telegraf";
import {config} from "../config";
import {User} from "../classes";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        if(user){
            let group =  user.info.groupName,
                id = user.info.id,
                surname = user.info.name,
                refKey = user.payment.referral.key
            let refBonus = config.paymentMessages.refBonus(user.info.id,user.payment.referral.agentsApprove)
            await ctx.reply(`Группа: <b>${group}</b>\nId: 🔗<code>${id}</code>\nФамилия: <b>${surname}</b>\nСтатус оплаты: <b>${config.payment.get(user.payment.status)}</b>\nСумма оплаты с учетом рефералки: <b>${Math.floor(user.payment.price-(user.payment.price*(refBonus/100)))}</b>\nРеферальный ключ: 🔗<code>${refKey}</code>\nБонус рефералов: <b>${refBonus}%</b>\nСвязь с админом: @a_korop`,{ parse_mode: 'HTML' })
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}