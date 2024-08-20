import {groups, users} from "../../index";
import {config} from "../../config";


export const dutyTable = (userId: number, num: number): { table: string }=> {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    const group = groups.getGroup(user.info.groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.duty.generateHTML(num);
    return { table };
};