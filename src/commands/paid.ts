import {Context} from "telegraf";
import {bot} from "../index";
import {User} from "../classes";
import {config} from "../config";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        if(user){
            if(user.info.id>0){
                await bot.telegram.sendMessage(6018898378,`${user.info.name}(${user.info.id}) оповестил об оплате, статус: ${config.payment.get(user.payment.status)}`,{
                    reply_markup: {
                        inline_keyboard: [[
                            { text: `Не оплачено`, callback_data: `paidStatus${user.info.id}` },
                            { text: `Оплачено`, callback_data: `userPaid${user.info.id}` }
                        ]]
                    }
                })
                await ctx.reply('Запрос на проверку оплаты отправлен, ожидайте')
            }else{await ctx.reply('Ошибка. Команда отправлена из группы')}
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}