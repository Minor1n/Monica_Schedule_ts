import {SQL} from "../sql";
import {bot} from "../index";
import {Context} from "telegraf";


export async function execute(ctx:Context){
    if(ctx.chat?.id){
        const user = await SQL.users.select(ctx.chat?.id);
        if(!user){
            await SQL.users.insert(ctx.chat.id, ctx.from?.username,"true",ctx.from?.username,await generateRefKey(ctx.chat.id))
            await bot.telegram.sendMessage(6018898378, `${ctx.chat.id} ${ctx.from?.username}, подключился к боту`)
        }
        await ctx.reply('Вы успешно активировали бота!\nДля корректной работы пропишите (/setname ваша фамилия) и (/setgroup).\nВы также можете ввести реферальный ключ командой (/referral реферальный ключ), вы получите доступ ко всем функциям на месяц бесплатно (до 1-го числа следующего месяца)')
    }
}

async function generateRefKey(num:number){
    if(num < 0){
        return 'null'
    }else{
        return num
            .toString()
            .split('')
            .map(Number)
            .map(n => (n || 10) + 64)
            .map(c => String.fromCharCode(Number(c)))
            .join('');
    }
}