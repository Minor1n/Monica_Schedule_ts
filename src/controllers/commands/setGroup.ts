import {Context} from "telegraf";
import {bot} from "@index";
import config from "@config";
import type ICommand from "@interfaces/ICommand";

export default {
    name: "setgroup",
    execute:  async function(ctx:Context){
        const chatId = ctx.chat?.id;
        if (!chatId) {
            return;
        }
        let user = bot.users.getUser(chatId);
        if (user) {
            bot.groups.all.sort((a, b) => a.name.localeCompare(b.name));
            let keyboard: { text: string, callback_data: string }[][] = [];
            bot.groups.all.forEach((group, index) => {
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
} satisfies ICommand;