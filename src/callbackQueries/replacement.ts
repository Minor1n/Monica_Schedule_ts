import tables from "../tables";
import {SettingsAll} from "../classes";
import {bot} from "../index";
import {config} from "../config";


export default async (data:string,userId:number)=>{
    const index = Number(data.slice(17))
    const user = bot.users.getUser(userId)
    if(!user)return
    const settings = await new SettingsAll().load();
    const replacementSettings = settings.getSettings('replacementLink');

    const responseText = await (await fetch(config.fetchUrl)).text();
    const dateRegex = /<strong>[А-Яа-я0-9. ]+/g;
    const dateMatches = responseText.match(dateRegex)

    const year = new Date().getFullYear();
    const linkRegex = new RegExp('<a href="http:\\/\\/rgkript.ru\\/wp-content\\/uploads\\/\\/'+year+'[0-9/.\\-A-Za-z_]+"','g')
    const links = Array.from(new Set(responseText.match(linkRegex))).map(link => link.slice(9, -1));

    const replacementRegExp = new RegExp('.doc|.pdf','g')
    const replacementLinks:string[] = <string[]> links.map(link=> {
        if(link.match(replacementRegExp)){
            return link
        }
    }).filter(Boolean)

    if (!dateMatches) {
        user.sendText('DateArr not found');
        return;
    }

    const dates = <string[]> dateMatches.map(match => match.match(/[0-9]+.[0-9]+.[0-9]+/g)?.[0]).filter(Boolean);

    if (replacementSettings && replacementLinks[index] !== replacementSettings.value) {
        user.sendAutoDeleteText(`Замены: ${dates[1]} ${replacementLinks[index].slice(36)}`, 1000 * 30);

        await tables.replacement(replacementLinks[index], dates[1])
        replacementSettings.value = replacementLinks[index];
    } else {
        user.sendAutoDeleteText('Замены не найдены', 1000 * 30);
    }
}