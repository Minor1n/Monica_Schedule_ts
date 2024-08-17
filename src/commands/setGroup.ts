import {Context} from "telegraf";
import {User,Groups} from "../classes";


export default async function(ctx:Context){
    if(ctx.chat?.id){
        let user = await new User().load(ctx.chat.id)
        if(user){
            let groups = await new Groups().load()
            let keyboard:{text:string,callback_data:string}[][] = [[]]
            let key = 0
            let key2 = 0
            for (let group of groups.all){
                if(key % 5 === 0 && key !== 0){
                    key2 +=1
                    keyboard.push([])
                    keyboard[key2].push({ text: group.name, callback_data: `setGroup${group.name}` })
                    key +=1
                }else{
                    keyboard[key2].push({ text: group.name, callback_data: `setGroup${group.name}` })
                    key +=1
                }
            }
            await ctx.reply('Выберите группу:',{
                reply_markup: {
                    inline_keyboard: keyboard
                }
            })
        }else{ await ctx.reply('Зарегистрируйтесь в боте /start') }
    }
}