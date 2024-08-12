import {Context} from "telegraf";
import {SQL} from "../sql";
import {config} from "../config";


export default async function(ctx:Context){
    console.log(ctx.chat?.id)
    if(ctx.chat?.id){
        console.log(1)
        let user = await SQL.users.select(ctx.chat.id)
        if(user){
            let group =  user.groupName,
                id = user.userId,
                surname = user.name,
                refKey = user.refKey,
                refNum = 0
            if(id === 1177837026||id === 6018898378){
                let referrals = await SQL.referral.select_by_agent(user.userId)
                for(let ref of referrals){
                    let userRef = await SQL.users.select(ref.userId)
                    if(ref.status === 'true' && userRef.paidWhenever === 'true'){
                        refNum+=1
                    }
                }
                await SQL.settings.update_number((36/100)*refNum*39.5,'agentCost')
            }
            let refBonus = id === 1177837026 || id === 6018898378 ? 38*refNum:6*user.refAgents
            await ctx.reply(`Группа: <b>${group}</b>\nId: 🔗<code>${id}</code>\nФамилия: <b>${surname}</b>\nСтатус оплаты: <b>${config.payment.get(user.payment)}</b>\nСумма оплаты с учетом рефералки: <b>${Math.floor(user.price-(user.price*(refBonus/100)))}</b>\nРеферальный ключ: 🔗<code>${refKey}</code>\nБонус рефералов: <b>${refBonus}%</b>\nСвязь с админом: @a_korop`,{ parse_mode: 'HTML' })
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}