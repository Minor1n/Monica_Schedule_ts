import {Context} from "telegraf";
import {bot} from "../index";
import {config} from "../config";
import {InlineKeyboardButton} from "@telegraf/types";


export default async function(id:number,ctx?:Context){
    if (id !== 6018898378) {
        if (ctx) await ctx.reply('Написано же ДЛЯ АДМИНОВ');
        return;
    }

    const user = bot.users.getUser(id)
    if(!user)return

    const responseText = await (await fetch(config.fetchUrl)).text();

    const year = new Date().getFullYear();
    const linkRegExp = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
    const links = Array.from(new Set(responseText.match(linkRegExp))).map(link => link.slice(9, -1));

    const scheduleRegExp = new RegExp('.xls','g')
    const replacementRegExp = new RegExp('.doc|.pdf','g')

    const scheduleLinks:string[] = <string[]> links.map(link=> {
        if(link.match(scheduleRegExp)){
            return link
        }
    }).filter(Boolean)
    const replacementLinks:string[] = <string[]> links.map(link=> {
        if(link.match(replacementRegExp)){
            return link
        }
    }).filter(Boolean)

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