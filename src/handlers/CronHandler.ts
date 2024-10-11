import {CronJob} from "cron";
import {payments, tables, fetchUtils} from "@utils";

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
    createCronJob('0 0 10 * * *', () => fetchUtils.cron());
    createCronJob('0 0 12 * * *', () => fetchUtils.cron());
    createCronJob('0 0 14 * * *', () => fetchUtils.cron());
    createCronJob('0 0 16 * * *', () => fetchUtils.cron());
    createCronJob('0 0 18 * * *', () => fetchUtils.cron());
    createCronJob('0 0 13 1 * *', payments.recount);
    createCronJob('0 35 7 25-31 * *', payments.preAlert);
    createCronJob('0 0 20 * * 6', tables.duty);
};