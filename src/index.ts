import {Bot} from "./classes/Bot";

const app = new Bot()
export const {bot,connection} = app
export let {gradients}=app
app.addGradients().then(gr=>{gradients = gr})

import {CronJob} from "cron";
import functions,{Functions} from "./functions";
import commands,{Commands} from "./commands";
import web from "./web";

web(__dirname)
commands()
functions()

CronJob.from({
    cronTime: '0 10 14 * * 1-5,7',
    onTick: async ()=>{
        await Commands.fetch(6018898378)
    },
    start: true,
});
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
//     cronTime: '0 10 14 * * 6',
//     onTick: async ()=>{
//         await Functions.duty.sender()
//     },
//     start: true,
// });