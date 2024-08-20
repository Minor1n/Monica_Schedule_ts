import {Context} from "telegraf";
import {users} from "../index";
import {config} from "../config";


export default async function (ctx:Context){
    const chatId = ctx.chat?.id;
    if (!chatId) {
        return;
    }
    const user = users.getUser(chatId);
    if (!user) {
        await ctx.reply(config.notfoundMessages.user);
        return;
    }
    const dates = [
        { name: 'Пнд', value: 1 },
        { name: 'Втр', value: 2 },
        { name: 'Срд', value: 3 },
        { name: 'Чтв', value: 4 },
        { name: 'Птн', value: 5 },
        { name: 'Сбт', value: 6 }
    ];
    const keyboard = dates.map(date => ({
        text: date.name,
        callback_data: `setDutyDay${date.value}`
    }));
    await ctx.reply('Выберите день:', {
        reply_markup: {
            inline_keyboard: [keyboard]
        }
    });
}