import {Context} from "telegraf";
import {SQL} from "../sql";


export default async function (ctx:Context){
    if(ctx.chat?.id){
        let user = await SQL.users.select(ctx.chat.id)
        if(user){
            let dates = [
                {name:'Пнд',value:1},
                {name:'Втр',value:2},
                {name:'Срд',value:3},
                {name:'Чтв',value:4},
                {name:'Птн',value:5},
                {name:'Сбт',value:6}
            ]
            let keyboard:{text:string,callback_data:string}[][] = [[]]
            for (let date of dates){
                keyboard[0].push({ text: date.name, callback_data: `setDutyDay${date.value}` })
            }
            await ctx.reply('Выберите день:',{
                reply_markup: {
                    inline_keyboard: keyboard
                }
            })
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}