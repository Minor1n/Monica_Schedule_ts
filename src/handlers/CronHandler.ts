import {CronJob} from "cron";
import commands from "../commands"
import payments from "../payments";
import tables from "../tables";

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
    createCronJob('0 0 10 * * *', () => commands.fetch(6018898378));
    createCronJob('0 0 12 * * *', () => commands.fetch(6018898378));
    createCronJob('0 0 14 * * *', () => commands.fetch(6018898378));
    createCronJob('0 0 16 * * *', () => commands.fetch(6018898378));
    createCronJob('0 0 18 * * *', () => commands.fetch(6018898378));
    createCronJob('0 0 13 1 * *', payments.recount);
    createCronJob('0 35 7 25-31 * *', payments.preAlert);
    createCronJob('0 0 20 * * 6', tables.duty);
};