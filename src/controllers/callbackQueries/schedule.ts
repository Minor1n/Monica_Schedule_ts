import schedule from "@utils/tables/schedule";
import {bot} from "@index";
import SettingsAll from "@classes/settings/SettingsAll";
import {fetchUtils} from "@utils";


export default async (data:string,userId:number)=>{
    const index = Number(data.slice(14))
    const user = bot.users.getUser(userId)
    if(!user)return
    const settings = await new SettingsAll().load();
    const scheduleSettings = settings.getSettings('scheduleLink');

    const {dates,links} = await fetchUtils.options(user)

    const scheduleRegExp = new RegExp('.xls','g')
    const scheduleLinks:string[] = <string[]> links.map(link=> {
        if(link.match(scheduleRegExp)){
            return link
        }
    }).filter(Boolean)

    if (scheduleSettings && scheduleLinks[index] !== scheduleSettings.value) {
        user.sendAutoDeleteText(`Расписание: ${dates[0]} ${scheduleLinks[index].slice(36)}`, 1000 * 30);

        await schedule(scheduleLinks[index])
        !bot.devMode ? scheduleSettings.value = scheduleLinks[index]:null;
    } else {
        user.sendAutoDeleteText('Расписание не найдено', 1000 * 30);
    }
}