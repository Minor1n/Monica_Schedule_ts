import start from './start'
import send from './send'
import duty from './duty'
import fetch from './fetch'
import paid from './paid'
import profile from './profile'
import referral from './referral'
import replacement from './replacement'
import restart from './restart'
import schedule from './schedule'
import setGroup from './setGroup'
import setName from './setName'
import settings from './settings'
import status from './status'
import theme from './theme'
import setDutyDay from "./setDutyDay";
import {bot} from "../index";



export const Commands = {
    start,
    send,
    duty,
    fetch,
    paid,
    profile,
    referral,
    replacement,
    restart,
    schedule,
    setGroup,
    setName,
    settings,
    status,
    theme,
    setDutyDay
}

export default ()=>{
    bot.command('start',async (ctx)=>{await start(ctx)})
    bot.command('fetch',async (ctx)=>{ await fetch(ctx.chat.id, ctx) })
    bot.command('send',async (ctx)=>{ await send(ctx) })
    bot.command('schedule',async (ctx)=>{ await schedule(ctx) })
    bot.command('theme',async (ctx)=>{ await theme(ctx) })
    bot.command('status',async (ctx)=>{ await status(ctx) })
    bot.command('settings',async (ctx)=>{ await settings(ctx) })
    bot.command('profile',async (ctx)=>{ await profile(ctx) })
    bot.command('setname',async (ctx)=>{ await setName(ctx) })
    bot.command('setgroup',async (ctx)=>{ await setGroup(ctx) })
    bot.command('referral',async (ctx)=>{ await referral(ctx) })
    bot.command('paid',async (ctx)=>{ await paid(ctx) })
    bot.command('replacement',async (ctx)=>{ await replacement(ctx) })
    bot.command('restart',async (ctx)=>{ await restart(ctx) })
    bot.command('duty',async (ctx)=>{ await duty(ctx) })
    bot.command('setdutydate',async (ctx)=>{ await setDutyDay(ctx) })
}