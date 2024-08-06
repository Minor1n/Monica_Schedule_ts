import {Context, Markup} from "telegraf";
import {bot} from "../index";
import {SQL} from "../sql";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat.id)
        if(user){
            if(user.userId>0){
                await bot.telegram.sendMessage(6018898378,`${user.name}(${user.userId}) оповестил об оплате, статус: ${user.payment}`,{
                    reply_markup: {
                        inline_keyboard: [[
                            { text: `Не оплачено`, callback_data: `paidStatus${user.userId}` },
                            { text: `Оплачено`, callback_data: `userPaid${user.userId}` }
                        ]]
                    }
                })
                await ctx.reply('Запрос на проверку оплаты отправлен, ожидайте')
            }else{await ctx.reply('Ошибка. Команда отправлена из группы')}
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}