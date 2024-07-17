import {Context} from "telegraf";
import {bot} from "../index";
import {SQL} from "../sql";


export async function execute(ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat.id)
        let {text}=ctx
        if(user){
            let surname = text?.slice(9)
            if(surname){
                await SQL.users.update_name(user.userId,surname)
                await ctx.reply(`Ваша фамилия - ${surname}`)
            }else{ await ctx.reply('Вы не указали фамилию(/setname ваша фамилия)') }
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}