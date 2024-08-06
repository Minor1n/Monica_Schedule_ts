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
app.get('/dutyTable/[0-9]+/[0-9]+', async (req, res) => {
    let nums = req.url.match(/[0-9]+/g)
    console.log(nums)
    if(!nums)return
    let user = await SQL.users.select(Number(nums[0]))
    let table = await Functions.duty.generateHTML(user.groupName,Number(nums[1]))
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


bot.command('start',(ctx)=>{Commands.start(ctx)})
bot.command('fetch',ctx=>{ Commands.fetch(ctx.chat.id,ctx) })
bot.command('send',ctx=>{ Commands.send(ctx) })
bot.command('schedule',ctx=>{ Commands.schedule(ctx) })
bot.command('theme',ctx=>{ Commands.theme(ctx) })
bot.command('status',ctx=>{ Commands.status(ctx) })
bot.command('settings',ctx=>{ Commands.settings(ctx) })
bot.command('profile',ctx=>{
    console.log('111'); Commands.profile(ctx) })
bot.command('setname',ctx=>{ Commands.setName(ctx) })
bot.command('setgroup',ctx=>{ Commands.setGroup(ctx) })
bot.command('referral',ctx=>{ Commands.referral(ctx) })
bot.command('paid',ctx=>{ Commands.paid(ctx) })
bot.hears("Отдежурил",ctx=>{ Functions.hears.duty(ctx) })
bot.command('replacement',ctx=>{ Commands.replacement(ctx) })
bot.command('restart',ctx=>{ Commands.restart(ctx) })
bot.command('duty',ctx=>{ Commands.duty(ctx) })
bot.command('setdutydate',ctx=>{ Commands.setDutyDay(ctx) })
bot.on('callback_query',async(ctx)=>{
    // @ts-ignore
    let data = ctx.callbackQuery?.data
    if(data.startsWith('userPaid')){
        await Functions.callback_query.userPaid(ctx,8)
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

CronJob.from({
    cronTime: '0 10 14 * * 1-5,7',
    onTick: async ()=>{
        await Commands.fetch(6018898378)
    },
    start: true,
});
// CronJob.from({
//     cronTime: '0 10 14 * * 6',
//     onTick: async ()=>{
//         await Functions.duty.sender()
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