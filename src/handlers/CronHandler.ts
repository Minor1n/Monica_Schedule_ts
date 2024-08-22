import {CronJob} from "cron";
import commands from "../commands"
import payments from "../payments";

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
    createCronJob('0 10 14 * * 1-5,7', () => commands.fetch(6018898378));
    createCronJob('0 0 13 1 * *', payments.recount);
    createCronJob('0 35 7 25-31 * *', payments.preAlert);
    //createCronJob('0 10 14 * * 6', Functions.duty.sender);
};