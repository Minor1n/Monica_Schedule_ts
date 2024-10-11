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

        const keyboardSchedules:InlineKeyboardButton[][] = scheduleLinks.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchSchedules${index}`
            }]
        })

        const keyboardReplacements:InlineKeyboardButton[][] = replacementLinks.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchReplacements${index}`
            }]
        })

        user.sendButtons('Доступны следующие url для расписания:',keyboardSchedules)
        user.sendButtons('Доступны следующие url для замен:',keyboardReplacements)
    }
} satisfies ICommand;