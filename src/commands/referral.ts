import {Context} from "telegraf";
import {User} from "../classes";
import {Functions} from "../functions";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        let {text} = ctx
        let refKey = text?.slice(10)
        if(refKey){
            await ctx.reply(await Functions.payment.setRefKey(user, refKey))
        }else{ await ctx.reply('Вы не указали реферальный ключ(/referral реферальный ключ)') }
    }
}