import {CronJob} from "cron";
import {InlineKeyboardButton} from "@telegraf/types";
import {bot} from "@index";
import SettingsAll from "@classes/settings/SettingsAll";
import {fetchUtils, payments, tables} from "@utils";

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
    const user = bot.users.getUser(6018898378)
    if(!user)return;

    const {scheduleLinks,replacementLinks} = await fetchUtils.links(user)

    const settings = await new SettingsAll().load();
    const scheduleSettings = settings.getSettings('scheduleLink');
    const replacementSettings = settings.getSettings('replacementLink');

    if (scheduleSettings && !scheduleLinks.find(link=> link === scheduleSettings.value)) {
        const keyboardSchedules:InlineKeyboardButton[][] = scheduleLinks.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchSchedules${index}`
            }]
        })
        user.sendButtons('Доступны следующие url для расписания:',keyboardSchedules)
    }

    if (replacementSettings && !replacementLinks.find(link=> link === replacementSettings.value)) {
        const keyboardReplacements:InlineKeyboardButton[][] = replacementLinks.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchReplacements${index}`
            }]
        })
        user.sendButtons('Доступны следующие url для замен:',keyboardReplacements)
    }
}