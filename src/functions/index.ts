import * as schedule from './schedule'
import * as replacement from './replacement'
import * as payment from './payment'
import * as callback_query from './callback_query'
import * as hears from './hears'
import * as duty from "./duty";
import {bot} from "../index";


export const Functions= {
    schedule,
    replacement,
    payment,
    callback_query,
    hears,
    duty
}

export default ()=>{
    bot.hears("Отдежурил",async (ctx)=>{ await hears.duty(ctx) })
    bot.on('callback_query',async(ctx)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        if(data.startsWith('userPaid')){
            await callback_query.userPaid(ctx,8)
        }else
        if(data.startsWith('paidStatus')){
            await callback_query.paidStatus(ctx)
        }else
        if(data.startsWith('userStatus')){
            await callback_query.userStatus(ctx)
        }else
        if(data.startsWith('vipStatus')){
            await callback_query.vipStatus(ctx)
        }else
        if(data.startsWith('settings')){
            if(data.startsWith('settingsSchedule')){
                await callback_query.settings.schedule(ctx)
            }else
            if(data.startsWith('settingsReplacement')){
                await callback_query.settings.replacement(ctx)
            }else
            if(data.startsWith('settingsDuty')){
                await callback_query.settings.duty(ctx)
            }
        }else
        if(data.startsWith('setGroup')){
            await callback_query.setGroup(ctx)
        }else
        if(data.startsWith('setDutyDay')){
            await callback_query.setDutyDay(ctx)
        }
    })
}