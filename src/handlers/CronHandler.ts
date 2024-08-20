import {CronJob} from "cron";
import {Commands} from "../commands";
import {Functions} from "../functions";

const createCronJob = (cronTime: string, onTick: () => Promise<void>) => {
    new CronJob(cronTime, async () => {
        try {
            await onTick();
        } catch (e) {
            console.error(e);
        }
    }, null, true);
};

export const CronHandler = () => {
    createCronJob('0 10 14 * * 1-5,7', () => Commands.fetch(6018898378));
    createCronJob('0 0 13 1 * *', Functions.payment.recount);
    createCronJob('0 35 7 25-31 * *', Functions.payment.preAlert);
    //createCronJob('0 10 14 * * 6', Functions.duty.sender);
};