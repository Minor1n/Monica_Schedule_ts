import {bot} from "../../index";
import {config} from "../../config";


export default (userId: number, num: number): { table: string }=> {
    const user = bot.users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    const group = bot.groups.getGroup(user.info.groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.duty.generateHTML(num);
    return { table };
};