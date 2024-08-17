import {bot} from "../index";
import {Functions} from "../functions";
import {User} from "../classes";

export const FunctionsHandler =()=>{
    bot.hears("Отдежурил",async (ctx)=>{ await Functions.hears.duty(ctx) })
    bot.on('callback_query',async(ctx)=>{
        // @ts-ignore
        let data = ctx.callbackQuery?.data
        if(data.startsWith('userPaid')){
            let user = await new User().load(Number(data.slice(8)))
            await Functions.callback_query.userPaid(ctx,user)
        }else
        if(data.startsWith('paidStatus')){
            await Functions.callback_query.paidStatus(ctx)
        }else
        if(data.startsWith('userStatus')){
            await Functions.callback_query.userStatus(ctx)
        }else
        if(data.startsWith('vipStatus')){
            await Functions.callback_query.vipStatus(ctx)
        }else
        if(data.startsWith('settings')){
            if(data.startsWith('settingsSchedule')){
                await Functions.callback_query.settings.schedule(ctx)
            }else
            if(data.startsWith('settingsReplacement')){
                await Functions.callback_query.settings.replacement(ctx)
            }else
            if(data.startsWith('settingsDuty')){
                await Functions.callback_query.settings.duty(ctx)
            }
        }else
        if(data.startsWith('setGroup')){
            await Functions.callback_query.setGroup(ctx)
        }else
        if(data.startsWith('setDutyDay')){
            await Functions.callback_query.setDutyDay(ctx)
        }
    })
}