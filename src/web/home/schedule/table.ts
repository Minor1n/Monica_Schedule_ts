import {bot} from "../../../index";
import {config} from "../../../config";


export default (userId: number): { table: string } => {
    const user = bot.users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    const group = bot.groups.getGroup(user.info.groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.schedule.html !== 'null' ? group.schedule.html : `<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`;
    return { table };
};
