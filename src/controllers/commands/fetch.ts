import {bot} from "@index";
import {Context} from "telegraf";
import {InlineKeyboardButton} from "@telegraf/types";
import ICommand from "@interfaces/ICommand";
import {fetchUtils} from "@utils";

export default {
    name: "fetch",
    execute: async function(ctx:Context){
        if (ctx.from?.id !== 6018898378) {
            if (ctx) await ctx.reply('Написано же ДЛЯ АДМИНОВ');
            return;
        }

        const user = bot.users.getUser(6018898378)
        if(!user)return

        const {scheduleLinks,replacementLinks} = await fetchUtils.links(user)

        if(!scheduleLinks[0]) {
            user.sendText('Расписания не найдены')
        }else{
            const keyboardSchedules:InlineKeyboardButton[][] = scheduleLinks.map((link,index) => {
                return[{
                    text:link.slice(36),
                    callback_data:`fetchSchedules${index}`
                }]
            })
            user.sendButtons('Доступны следующие url для расписания:',keyboardSchedules)
        }

        if(!replacementLinks[0]) {
            user.sendText('Замены не найдены')
        }else{
            const keyboardReplacements:InlineKeyboardButton[][] = replacementLinks.map((link,index) => {
                return[{
                    text:link.slice(36),
                    callback_data:`fetchReplacements${index}`
                }]
            })
            user.sendButtons('Доступны следующие url для замен:',keyboardReplacements)
        }
    }
} satisfies ICommand;