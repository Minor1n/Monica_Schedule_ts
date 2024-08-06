import {Context, Markup} from "telegraf";
import {SQL, User} from "../sql";
import {Functions} from "./index";
import {bot} from "../index";


export async function userPaid(ctx:Context,slice:number){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = data.slice(slice)
    let user =  await SQL.users.select(id)
    ctx.editMessageText(`Текущий статус: ${user.payment}\nИзменить статус на:`,{reply_markup: {
            inline_keyboard: [[Markup.button.callback("true",`userStatus_true__${id}`),
                Markup.button.callback("false",`userStatus_false_${id}`),
                Markup.button.callback("free",`userStatus_free__${id}`),
                Markup.button.callback("vip",`userStatus_vip___${id}`),
                Markup.button.callback("ban",`userStatus_ban___${id}`),
                Markup.button.callback("↩️",`userStatus_undo`)]]
        }}).catch((e:Error)=>{console.log(e)});
}

export async function userStatus(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = data.slice(17)
    let user =  await SQL.users.select(id)
    if(data.slice(11).startsWith("vip")){
        ctx.editMessageText(`Уровень VIP:`,{reply_markup: {inline_keyboard: [[
            Markup.button.callback("VIP0",`vipStatus_0_${id}`),
            Markup.button.callback("VIP1",`vipStatus_1_${id}`),
            Markup.button.callback("VIP2",`vipStatus_2_${id}`),
            Markup.button.callback("VIP3",`vipStatus_3_${id}`),
            Markup.button.callback("VIP4",`vipStatus_4_${id}`),
            Markup.button.callback("↩️",`userStatus_undo`)
        ]]}}).catch((e:Error)=>{console.log(e)});
    }else

    if(data.slice(11).startsWith("ban")){
        await SQL.users.update_payment(id,"ban")
        await Functions.payment.referral(user,'false')
        await bot.telegram.sendMessage(user.userId,"Вы были заблокированы администратором").catch((e:Error)=>{console.log(e)})
        await ctx.telegram.answerCbQuery(String(ctx.callbackQuery?.id), `Успешно`, {show_alert: true}).catch((e:Error)=>{console.log(e)});
    }else

    if(data.slice(11).startsWith("undo")){
        let usersKeyboard = await Functions.payment.paid()
        ctx.editMessageText(`Изменить статус для:`, {
            reply_markup: {
                inline_keyboard: usersKeyboard
            }
        }).catch((e:Error)=>{console.log(e)});

    }else{
        let status = data.slice(11).startsWith("false") ? "false" : data.slice(11,15)
        await SQL.users.update_payment(id,status)
        if(status !=='false'){ await Functions.payment.referral(user,'true'); await SQL.users.update_paidWhenever(user.userId,'true')}
        if(status ==='false'){ await Functions.payment.referral(user,'false') }
        await bot.telegram.sendMessage(user.userId,`Вы получили статус: ${status==="true"||status==="free" ? "оплачен":"не оплачен"}`).catch((e:Error)=>{console.log(e)})
        await ctx.telegram.answerCbQuery(String(ctx.callbackQuery?.id), `Успешно`, {show_alert: true}).catch((e:Error)=>{console.log(e)});
    }
}

export async function vipStatus(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = data.slice(12)
    let user =  await SQL.users.select(id)
    let status = `vip${data.slice(10,11)}`
    await SQL.users.update_payment(id,status)
    await SQL.users.update_paidWhenever(id,'true')
    await Functions.payment.referral(user,'true')
    await bot.telegram.sendMessage(user.userId,`Вы получили статус: ${status}`).catch((e:Error)=>{console.log(e)})
    await ctx.telegram.answerCbQuery(String(ctx.callbackQuery?.id), `Успешно`, {show_alert: true}).catch((e:Error)=>{console.log(e)});
}

export async function setGroup(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = ctx.from?.id
    let group = data.slice(8)
    if(id)
    await SQL.users.update_group(id,group)
    await ctx.editMessageText(`Установленна группа: ${group}`).catch((e:Error)=>{console.log(e)});
}

export async function paidStatus(ctx:Context){
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    let id = data.slice(10)
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
    if(id)
        await SQL.users.update_scheduleDate(id,day)
    await ctx.editMessageText(`Установлен день: ${days.get(day)}`).catch((e:Error)=>{console.log(e)});
}

export const settings  ={
    keyboard: async (user:User)=>{
        return([
            [
                Markup.button.callback(`Дежурства: ${user.settingsDuty}`,`settingsDuty${user.userId}`),
                Markup.button.callback(`Расписание: ${user.settingsSchedule}`,`settingsSchedule${user.userId}`),
                Markup.button.callback(`Замены: ${user.settingsReplacement}`,`settingsReplacement${user.userId}`)
            ]
        ])
    },

    schedule: async (ctx:Context)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        let user = await SQL.users.select(data.slice(16))
        await SQL.users.settings.update_schedule(user.userId, user.settingsSchedule === "on"?"off":"on")
        user.settingsSchedule = user.settingsSchedule === "on"?"off":"on"
        await ctx.editMessageText(`Настройки:`, {
            reply_markup: {
                inline_keyboard: await settings.keyboard(user)
            }
        }).catch(e=>{console.log(e)});
    },

    replacement: async (ctx:Context)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        let user = await SQL.users.select(data.slice(19))
        await SQL.users.settings.update_replacement(user.userId, user.settingsReplacement === "on"?"off":"on")
        user.settingsReplacement = user.settingsReplacement === "on"?"off":"on"
        await ctx.editMessageText(`Настройки:`, {
            reply_markup: {
                inline_keyboard: await Functions.callback_query.settings.keyboard(user)
            }
        }).catch(e=>{console.log(e)});
    },

    duty: async (ctx:Context)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        let user = await SQL.users.select(data.slice(12))
        await SQL.users.settings.update_duty(user.userId, user.settingsDuty === "on"?"off":"on")
        user.settingsDuty = user.settingsDuty === "on"?"off":"on"
        await ctx.editMessageText(`Настройки:`, {
            reply_markup: {
                inline_keyboard: await Functions.callback_query.settings.keyboard(user)
            }
        }).catch(e=>{console.log(e)});
    },

}