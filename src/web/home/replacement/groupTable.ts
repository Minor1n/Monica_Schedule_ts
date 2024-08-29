import {bot} from "../../../index";
import {config} from "../../../config";


export default (userId:number):{table:string}=>{
    const user = bot.users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    const group = bot.groups.getGroup(user.info.groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.replacement.html !== 'null' ? group.replacement.html : `<tr><td><b>Замены для вашей группы не найдены!</b></td></tr>`;
    return { table };
}