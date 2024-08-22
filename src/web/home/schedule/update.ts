import {bot} from "../../../index";
import {config} from "../../../config";


export default (groupName: string): { table: string } => {
    const group = bot.groups.getGroup(groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.schedule.html !== 'null' ? group.schedule.html : `<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`;
    return { table };
};