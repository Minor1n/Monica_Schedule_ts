import {bot} from "../index";
import {Commands} from "../commands";

export const CommandsHandler = ()=>{
    bot.command('start',async (ctx)=>{await Commands.start(ctx)})
    bot.command('fetch',async (ctx)=>{ await Commands.fetch(ctx.chat.id, ctx) })
    bot.command('send',async (ctx)=>{ await Commands.send(ctx) })
    bot.command('schedule',async (ctx)=>{ await Commands.schedule(ctx) })
    bot.command('theme',async (ctx)=>{ await Commands.theme(ctx) })
    bot.command('status',async (ctx)=>{ await Commands.status(ctx) })
    bot.command('settings',async (ctx)=>{ await Commands.settings(ctx) })
    bot.command('profile',async (ctx)=>{ await Commands.profile(ctx) })
    bot.command('setname',async (ctx)=>{ await Commands.setName(ctx) })
    bot.command('setgroup',async (ctx)=>{ await Commands.setGroup(ctx) })
    bot.command('referral',async (ctx)=>{ await Commands.referral(ctx) })
    bot.command('paid',async (ctx)=>{ await Commands.paid(ctx) })
    bot.command('replacement',async (ctx)=>{ await Commands.replacement(ctx) })
    bot.command('restart',async (ctx)=>{ await Commands.restart(ctx) })
    bot.command('duty',async (ctx)=>{ await Commands.duty(ctx) })
    bot.command('setdutydate',async (ctx)=>{ await Commands.setDutyDay(ctx) })
}