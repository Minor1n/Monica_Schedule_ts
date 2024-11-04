import {CronJob} from "cron";
import {payments, tables, fetchUtils} from "@utils";
import { exec } from 'child_process';

const createCronJob = (cronTime: string, onTick: () => Promise<void>) => {
    new CronJob(cronTime, async () => {
        try {
            await onTick();
        } catch (e) {
            console.error(e);
        }
    }, null, true);
};

export default () => {
    createCronJob('0 0 10 * 1-6,9-12 *', () => fetchUtils.cron());
    createCronJob('0 0 12 * 1-6,9-12 *', () => fetchUtils.cron());
    createCronJob('0 0 14 * 1-6,9-12 *', () => fetchUtils.cron());
    createCronJob('0 0 16 * 1-6,9-12 *', () => fetchUtils.cron());
    createCronJob('0 0 18 * 1-6,9-12 *', () => fetchUtils.cron());
    createCronJob('0 0 13 1 1-6,9-12 *', payments.recount);
    createCronJob('0 35 7 25-31 1-6,9-12 *', payments.preAlert);
    createCronJob('0 0 20 * 1-6,9-12 6', tables.duty);
    createCronJob('0 0 4 * * *', async ()=>{
        exec('pm2 restart Monica_Schedule', (error, stdout) => {
            if (error) {
                console.error(`Ошибка перезапуска: ${error}`);
            }
            console.log(`Вывод перезапуска: ${stdout}`);
        });
    });
    createCronJob('0 0 5 * * *', async () => {
        exec('pm2 restart Monica_Schedule_Site', (error, stdout) => {
            if (error) {
                console.error(`Ошибка перезапуска: ${error}`);
            }
            console.log(`Вывод перезапуска: ${stdout}`);
        });
    });
};