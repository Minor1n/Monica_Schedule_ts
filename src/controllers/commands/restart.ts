import {Context} from "telegraf";
import ICommand from "@interfaces/ICommand";

export default {
    name: "restart",
    execute: async function(ctx:Context){
        if(ctx.chat?.id === 6018898378){
            await ctx.reply('Бот выключен!')
            setTimeout(()=>{
                process.exit(0)
            },1000*30)
        }else{await ctx.reply('Написано же ДЛЯ АДМИНОВ')}
    }
} satisfies ICommand;