import {Context} from "telegraf";
import {SettingsAll} from "../classes";
import {bot} from "../index";
import {config} from "../config";
import tables from "../tables";


export default async function(id:number,ctx?:Context){
    if (id !== 6018898378) {
        if (ctx) await ctx.reply('Написано же ДЛЯ АДМИНОВ');
        return;
    }

    const user = bot.users.getUser(id)
    if(!user)return
    const settings = await new SettingsAll().load();
    const scheduleSettings = settings.getSettings('scheduleLink');
    const replacementSettings = settings.getSettings('replacementLink');

    const responseText = await (await fetch(config.fetchUrl)).text();

    const year = new Date().getFullYear();
    const linkRegex = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
    const dateRegex = /<strong>[А-Яа-я0-9. ]+/g;
    const links = Array.from(new Set(responseText.match(linkRegex))).map(link => link.slice(9, -1));
    const dateMatches = responseText.match(dateRegex);
    console.log(links)
    if (!dateMatches) {
        user.sendText('DateArr not found');
        return;
    }

    const dates = <string[]> dateMatches.map(match => match.match(/[0-9]+.[0-9]+.[0-9]+/g)?.[0]).filter(Boolean);

    if (scheduleSettings && links[0] !== scheduleSettings.value) {
        scheduleSettings.value = links[0];
        user.sendAutoDeleteText(`Расписание: ${dates[0]} ${links[0].slice(36)}`, 1000 * 30);

        await tables.schedule(links[0])
    } else {
        user.sendAutoDeleteText('Расписание не найдено', 1000 * 30);
    }

    if (replacementSettings && links[2] !== replacementSettings.value) {
        replacementSettings.value = links[2];
        user.sendAutoDeleteText(`Замены: ${dates[1]} ${links[2].slice(36)}`, 1000 * 30);

        await tables.replacement(links[2], dates[1])
    } else {
        user.sendAutoDeleteText('Замены не найдены', 1000 * 30);
    }
}