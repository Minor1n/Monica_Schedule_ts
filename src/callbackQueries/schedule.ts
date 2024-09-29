import tables from "../tables";
import {bot} from "../index";
import {SettingsAll} from "../classes";
import {config} from "../config";


export default async (data:string,userId:number)=>{
    const index = Number(data.slice(14))
    const user = bot.users.getUser(userId)
    if(!user)return
    const settings = await new SettingsAll().load();
    const scheduleSettings = settings.getSettings('scheduleLink');

    const responseText = await (await fetch(config.fetchUrl)).text();
    const dateRegex = /<strong>[А-Яа-я0-9. ]+/g;
    const dateMatches = responseText.match(dateRegex)

    const year = new Date().getFullYear();
    const linkRegex = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
    const links = Array.from(new Set(responseText.match(linkRegex))).map(link => link.slice(9, -1));

    const scheduleRegExp = new RegExp('.xls','g')
    const scheduleLinks:string[] = <string[]> links.map(link=> {
        if(link.match(scheduleRegExp)){
            return link
        }
    }).filter(Boolean)

    if (!dateMatches) {
        user.sendText('DateArr not found');
        return;
    }

    const dates = <string[]> dateMatches.map(match => match.match(/[0-9]+.[0-9]+.[0-9]+/g)?.[0]).filter(Boolean);

    if (scheduleSettings && scheduleLinks[index] !== scheduleSettings.value) {
        user.sendAutoDeleteText(`Расписание: ${dates[0]} ${scheduleLinks[index].slice(36)}`, 1000 * 30);

        await tables.schedule(scheduleLinks[index])
        scheduleSettings.value = scheduleLinks[index];
    } else {
        user.sendAutoDeleteText('Расписание не найдено', 1000 * 30);
    }
}