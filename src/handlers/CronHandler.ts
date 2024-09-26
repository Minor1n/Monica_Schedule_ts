import {CronJob} from "cron";
import payments from "../payments";
import tables from "../tables";
import {bot} from "../index";
import {config} from "../config";
import {InlineKeyboardButton} from "@telegraf/types";
import {SettingsAll} from "../classes";

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

    const responseText = await (await fetch(config.fetchUrl)).text();

    const year = new Date().getFullYear();
    const linkRegex = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
    const links = Array.from(new Set(responseText.match(linkRegex))).map(link => link.slice(9, -1));

    const settings = await new SettingsAll().load();
    const scheduleSettings = settings.getSettings('scheduleLink');
    const replacementSettings = settings.getSettings('replacementLink');

    if (scheduleSettings && links[0] !== scheduleSettings.value) {
        const keyboardSchedules:InlineKeyboardButton[][] = links.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchSchedules${index}`
            }]
        })
        user.sendButtons('Доступны следующие url для расписания:',keyboardSchedules)
    }

    if (replacementSettings && links[1] !== replacementSettings.value) {
        const keyboardReplacements:InlineKeyboardButton[][] = links.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchReplacements${index}`
            }]
        })
        user.sendButtons('Доступны следующие url для замен:',keyboardReplacements)
    }
}