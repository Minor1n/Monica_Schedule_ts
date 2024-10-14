import replacement from "@utils/tables/replacement";
import SettingsAll from "@classes/settings/SettingsAll";
import {bot} from "@index";
import {fetchUtils} from "@utils";


export default async (data:string,userId:number)=>{
    const index = Number(data.slice(17))
    const user = bot.users.getUser(userId)
    if(!user)return
    const settings = await new SettingsAll().load();
    const replacementSettings = settings.getSettings('replacementLink');

    const {dates,links} = await fetchUtils.options(user)

    const replacementRegExp = new RegExp('.doc|.pdf','g')
    const replacementLinks:string[] = <string[]> links.map(link=> {
        if(link.match(replacementRegExp)){
            return link
        }
    }).filter(Boolean)

    if (replacementSettings && replacementLinks[index] !== replacementSettings.value) {
        user.sendAutoDeleteText(`Замены: ${dates[1]} ${replacementLinks[index].slice(36)}`, 1000 * 30);

        await replacement(replacementLinks[index], dates[1])
        !bot.devMode ? replacementSettings.value = replacementLinks[index]:null;
    } else {
        user.sendAutoDeleteText('Замены не найдены', 1000 * 30);
    }
}