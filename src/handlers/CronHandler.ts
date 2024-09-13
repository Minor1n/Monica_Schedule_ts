import {CronJob} from "cron";
import payments from "../payments";
import tables from "../tables";
import callbackQueries from "../callbackQueries";

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
    createCronJob('0 0 10 * * *', () => fetchUrls());
    createCronJob('0 0 12 * * *', () => fetchUrls());
    createCronJob('0 0 14 * * *', () => fetchUrls());
    createCronJob('0 0 16 * * *', () => fetchUrls());
    createCronJob('0 0 18 * * *', () => fetchUrls());
    createCronJob('0 0 13 1 * *', payments.recount);
    createCronJob('0 35 7 25-31 * *', payments.preAlert);
    createCronJob('0 0 20 * * 6', tables.duty);
};



const fetchUrls = async ()=>{
    await callbackQueries.fetch.schedule('fetchSchedules0', 6018898378)
    await callbackQueries.fetch.replacement('fetchReplacements2', 6018898378)
}