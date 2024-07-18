import {config} from "./config";
import {Telegraf} from "telegraf";
export const bot = new Telegraf(config.TOKEN);
bot.launch(); bot.telegram.sendMessage(6018898378,'Бот запущен!')
    .then(msg=>setTimeout(()=>{bot.telegram.deleteMessage(msg.chat.id,msg.message_id)},30*1000)).catch(e=>{console.log(e)})
import {CronJob} from "cron";
import * as path from "node:path";
import express from "express";
import cors from "cors";
import * as http from "node:http";
import {SQL} from "./sql";
import {Functions} from "./functions";
import {Commands} from "./commands";


let app = express()
app.use(cors());
app.get('/', (req, res) => {res.sendFile(path.join(__dirname+'/index.html'))})
app.get('/scheduleTable/[0-9]+', async (req, res) => {
    let user = await SQL.users.select(Number(req.url.slice(15)))
    let table = await SQL.groups.select_schedule(user.groupName)
    res.send({table: table.schedule});
})
app.get('/replacementTable/[0-9]+', async (req, res) => {
    let replacement = await SQL.replacement.select_by_index(Number(req.url.slice(18)))
    let table = replacement ? replacement.html : null
    res.send({table: table});
})
app.get("/randomGradient", async (req,res) => {
    let gradients = await SQL.gradients.select_all_gradients()
    let gradient = gradients[Math.floor(Math.random() * (gradients.length-1))]
    res.send({gradient: gradient.slice(11, -1)});
});
app.get('/selectGroup/[0-9]+', async (req, res) => {
    let user = await SQL.users.select(Number(req.url.slice(13)))
    let groups = await SQL.groups.select_all()
    let table = []
    let table2 = []
    for(let group of groups){
        if(group.name === user.groupName){
            table.push(`<option selected value='${group.name}'>${group.name}</option>`)
        }else if(group.schedule === 'null'){
            table2.push(`<option disabled value='${group.name}'>${group.name}</option>`)
        }
        else{
            table.push(`<option value='${group.name}'>${group.name}</option>`)
        }
    }
    res.send({table: table.concat(table2).join('')});
})
app.get('/updateGroup/[0-9\%A-Za-z\-]+', async (req, res) => {
    let table = await SQL.groups.select_schedule(decodeURI(req.url.slice(13)))
    res.send({table: table.schedule});
})

const httpServer = http.createServer(app);
httpServer.listen(3000,'46.23.96.113');


bot.command('start',(ctx)=>{Commands.start.execute(ctx)})
bot.command('fetch',ctx=>{ Commands.fetch.execute(ctx.chat.id,ctx) })
bot.command('send',ctx=>{ Commands.send.execute(ctx) })
bot.command('schedule',ctx=>{ Commands.schedule.execute(ctx) })
bot.command('theme',ctx=>{ Commands.theme.execute(ctx) })
bot.command('status',ctx=>{ Commands.status.execute(ctx) })
bot.command('settings',ctx=>{ Commands.settings.execute(ctx) })
bot.command('profile',ctx=>{
    console.log('111'); Commands.profile.execute(ctx) })
bot.command('setname',ctx=>{ Commands.setName.execute(ctx) })
bot.command('setgroup',ctx=>{ Commands.setGroup.execute(ctx) })
bot.command('referral',ctx=>{ Commands.referral.execute(ctx) })
bot.command('paid',ctx=>{ Commands.paid.execute(ctx) })
//bot.hears("Отдежурил",ctx=>{ Functions.hears.duty(ctx) })
bot.command('replacement',ctx=>{ Commands.replacement.execute(ctx) })
bot.command('restart',ctx=>{ Commands.restart.execute(ctx) })
bot.command('duty',ctx=>{ Commands.duty.execute(ctx) })
bot.on('callback_query',async(ctx)=>{
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    if(data.startsWith('userPaid')){
        await Functions.callback_query.userPaid(ctx,8)
    }
    if(data.startsWith('paidStatus')){
        await Functions.callback_query.paidStatus(ctx)
    }
    if(data.startsWith('userStatus')){
        await Functions.callback_query.userStatus(ctx)
    }
    if(data.startsWith('vipStatus')){
        await Functions.callback_query.vipStatus(ctx)
    }
    if(data.startsWith('settings')){
        if(data.startsWith('settingsSchedule')){
            await Functions.callback_query.settings.schedule(ctx)
        }
        if(data.startsWith('settingsReplacement')){
            await Functions.callback_query.settings.replacement(ctx)
        }
        if(data.startsWith('settingsDuty')){
            await Functions.callback_query.settings.duty(ctx)
        }
    }
    if(data.startsWith('setGroup')){
        await Functions.callback_query.setGroup(ctx)
    }
})


CronJob.from({
    cronTime: '0 10 14 * * 1-5,7',
    onTick: async ()=>{
        await Commands.fetch.execute(6018898378)
    },
    start: true,
});
// CronJob.from({
//     cronTime: '0 30 7 * * 1-6',
//     onTick: async ()=>{
//         await Functions.duty.update().catch(e=>{console.log(e)})
//     },
//     start: true,
// });
CronJob.from({
    cronTime: '0 0 13 1 * *',
    onTick: async ()=>{
        await Functions.payment.recount().catch(e=>{console.log(e)});
    },
    start: true,
});
CronJob.from({
    cronTime: '0 35 7 25-31 * *',
    onTick: async ()=>{
        await Functions.payment.preAlert().catch(e=>{console.log(e)});
    },
    start: true,
});
// CronJob.from({
//     cronTime: '0 0 8 * * 0',
//     onTick: async ()=>{
//         await Functions.duty.recount().catch(e=>{console.log(e)});
//     },
//     start: true,
// });