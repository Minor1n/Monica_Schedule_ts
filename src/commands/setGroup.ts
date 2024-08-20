import {Context} from "telegraf";
import {groups, users} from "../index";
import {config} from "../config";


export default async function(ctx:Context){
    const chatId = ctx.chat?.id;
    if (!chatId) {
        return;
    }
    let user = users.getUser(chatId);
    if (user) {
        groups.all.sort((a, b) => a.name.localeCompare(b.name));
        let keyboard: { text: string, callback_data: string }[][] = [];
        groups.all.forEach((group, index) => {
            let rowIndex = Math.floor(index / 5);
            if (!keyboard[rowIndex]) {
                keyboard[rowIndex] = [];
            }
            keyboard[rowIndex].push({
                text: group.name,
                callback_data: `setGroup${group.name}`
            });
        });
        await ctx.reply('Выберите группу:', {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } else {
        await ctx.reply(config.notfoundMessages.user);
    }
}