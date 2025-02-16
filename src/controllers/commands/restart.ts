import {Context} from "telegraf";
import ICommand from "@interfaces/ICommand";
import {exec} from "child_process";

export default {
    name: "restart",
    execute: async function(ctx:Context){
        if(ctx.chat?.id === 6018898378){
            await ctx.reply('Бот выключен!')
            setTimeout(()=>{
                exec('pm2 restart Monica_Schedule', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Ошибка перезапуска: ${error}`);
                    }
                    console.log(`Вывод перезапуска: ${stdout}`);
                });
            },1000*30)
        }else{await ctx.reply('Написано же ДЛЯ АДМИНОВ')}
    }
} satisfies ICommand;