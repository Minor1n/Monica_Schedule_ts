import {bot} from "@index";
import {fetchUtils} from "@utils";
import SettingsAll from "@classes/settings/SettingsAll";
import type {InlineKeyboardButton} from "@telegraf/types";


export default async ()=>{
    const user = bot.users.getUser(6018898378)
    if(!user)return;

    const {scheduleLinks,replacementLinks} = await fetchUtils.links(user)

    const settings = await new SettingsAll().load();
    const scheduleSettings = settings.getSettings('scheduleLink');
    const replacementSettings = settings.getSettings('replacementLink');

    if (scheduleLinks[0] && scheduleSettings && !scheduleLinks.find(link=> link === scheduleSettings.value)) {
        const keyboardSchedules:InlineKeyboardButton[][] = scheduleLinks.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchSchedules${index}`
            }]
        })
        user.sendButtons('Доступны следующие url для расписания:',keyboardSchedules)
    }

    if (replacementLinks[0] && replacementSettings && !replacementLinks.find(link=> link === replacementSettings.value)) {
        const keyboardReplacements:InlineKeyboardButton[][] = replacementLinks.map((link,index) => {
            return[{
                text:link.slice(36),
                callback_data:`fetchReplacements${index}`
            }]
        })
        user.sendButtons('Доступны следующие url для замен:',keyboardReplacements)
    }
}