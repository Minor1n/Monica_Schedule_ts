import {Context} from "telegraf";
import {bot} from "../index";


export async function execute(ctx:Context){
    if(ctx.chat?.id === 6018898378){
        await ctx.reply('Бот выключен!')
        setTimeout(() => {
            process.exit(0)
        }, 1000 * 60)
    }else{await ctx.reply('Написано же ДЛЯ АДМИНОВ')}
}