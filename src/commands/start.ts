import {bot} from "../index";
import {Context} from "telegraf";
import {Users} from "../classes/User";


export default async function(ctx:Context){
    if(ctx.chat?.id&&ctx.from?.username){
        const users = await new Users().load()
        if(!users.getUser(ctx.chat.id)){
            await users.createUser(ctx.chat.id, ctx.from.username, 2, ctx.from.username, await generateRefKey(ctx.chat.id))
            await bot.telegram.sendMessage(6018898378, `${ctx.chat.id} ${ctx.from.username}, подключился к боту`)
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