import {Context, Markup} from "telegraf";
import {Functions} from "./index";
import {bot} from "../index";
import {config} from "../config";
import {User} from "../classes";


export async function userPaid(ctx:Context,user:User){
    ctx.editMessageText(`Текущий статус: ${config.payment.get(user.payment.status)}\nИзменить статус на:`,{reply_markup: {
            inline_keyboard: [[Markup.button.callback("true",`userStatus_2___${user.info.id}`),
                Markup.button.callback("false",`userStatus_1___${user.info.id}`),
                Markup.button.callback("free", `userStatus_f___${user.info.id}`),
                Markup.button.callback("vip",  `userStatus_vip_${user.info.id}`),
                Markup.button.callback("ban",  `userStatus_0___${user.info.id}`),
                Markup.button.callback("↩️",`userStatus_undo`)]]
        }}).catch((e:Error)=>{console.log(e)});
}

export async function userStatus(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data.slice(11)
    let id = Number(data.slice(4))
    let user = id===0?undefined: await new User().load(id)
    if(data.startsWith("vip")){
        ctx.editMessageText(`Уровень VIP:`,{reply_markup: {inline_keyboard: [[
            Markup.button.callback("2мес",`vipStatus_3_${id}`),
            Markup.button.callback("3мес",`vipStatus_4_${id}`),
            Markup.button.callback("4мес",`vipStatus_5_${id}`),
            Markup.button.callback("5мес",`vipStatus_6_${id}`),
            Markup.button.callback("6мес",`vipStatus_7_${id}`),
            Markup.button.callback("↩️",`userStatus_undo`)
        ]]}}).catch((e:Error)=>{console.log(e)});
    }else
    if(data.startsWith("undo")){
        let usersKeyboard = await Functions.payment.paid()
        ctx.editMessageText(`Изменить статус для:`, {
            reply_markup: {
                inline_keyboard: usersKeyboard
            }
        }).catch((e:Error)=>{console.log(e)});
    }else{
        if(!user)return
        let status:number = data.startsWith("f") ? -1 : Number(data.slice(0,1)) //2,1,-1,0
        user.payment.status = status
        user.payment.paid = 'true'
        await Functions.callback_query.userPaid(ctx,user)
        if(status === 0){
            await bot.telegram.sendMessage(user.info.id,"Вы были заблокированы администратором").catch((e:Error)=>{console.log(e)})
        }else{
            await bot.telegram.sendMessage(user.info.id,config.paymentMessages.changeStatus(status)).catch((e:Error)=>{console.log(e)})
        }
    }
}

export async function vipStatus(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = Number(data.slice(12))
    let user = await new User().load(id)
    let status = Number(data.slice(10,11))
    user.payment.status = status
    user.payment.paid = 'true'
    await Functions.callback_query.userPaid(ctx,user)
    await bot.telegram.sendMessage(user.info.id,config.paymentMessages.changeStatus(status)).catch((e:Error)=>{console.log(e)})
}

export async function setGroup(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = ctx.from?.id
    let group = String(data.slice(8))
    if(id){
        let user = await new User().load(id)
        user.info.groupName = group
        await ctx.editMessageText(`Установленна группа: ${group}`).catch((e:Error)=>{console.log(e)});
    }
}

export async function paidStatus(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = Number(data.slice(10))
    await bot.telegram.sendMessage(id,`Ошибка. Вы не оплатили подписку!`).catch((e:Error)=>{console.log(e)});
    bot.telegram.deleteMessage(Number(ctx.callbackQuery?.from.id),Number(ctx.callbackQuery?.message?.message_id)).catch((e:Error)=>{console.log(e)})
}

export async function setDutyDay(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = ctx.from?.id
    let day = Number(data.slice(10))
    let days = new Map()
        .set(1,'Понедельник')
        .set(2,'Вторник')
        .set(3,'Среда')
        .set(4,'Четверг')
        .set(5,'Пятница')
        .set(6,'Суббота')
    if(id){
        let user = await new User().load(id)
        user.duty.day = day
        await ctx.editMessageText(`Установлен день: ${days.get(day)}`).catch((e:Error)=>{console.log(e)});
    }
}

export const settings  = {
    keyboard: async (user:User)=>{
        return([
            [
                Markup.button.callback(`Дежурства: ${user.settings.duty}`,`settingsDuty${user.info.id}`),
                Markup.button.callback(`Расписание: ${user.settings.schedule}`,`settingsSchedule${user.info.id}`),
                Markup.button.callback(`Замены: ${user.settings.replacement}`,`settingsReplacement${user.info.id}`)
            ]
        ])
    },

    schedule: async (ctx:Context)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        let user = await new User().load(Number(data.slice(16)))
        user.settings.switchSchedule()
        await ctx.editMessageText(`Настройки:`, {
            reply_markup: {
                inline_keyboard: await settings.keyboard(user)
            }
        }).catch(e=>{console.log(e)});
    },

    replacement: async (ctx:Context)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        let user = await new User().load(Number(data.slice(19)))
        user.settings.switchReplacement()
        await ctx.editMessageText(`Настройки:`, {
            reply_markup: {
                inline_keyboard: await Functions.callback_query.settings.keyboard(user)
            }
        }).catch(e=>{console.log(e)});
    },

    duty: async (ctx:Context)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        let user = await new User().load(Number(data.slice(12)))
        user.settings.switchDuty()
        await ctx.editMessageText(`Настройки:`, {
            reply_markup: {
                inline_keyboard: await Functions.callback_query.settings.keyboard(user)
            }
        }).catch(e=>{console.log(e)});
    },

}