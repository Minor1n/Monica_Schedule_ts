import {groups, users} from "../../index";
import {config} from "../../config";


export const scheduleTable = (userId: number): { table: string } => {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    const group = groups.getGroup(user.info.groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.schedule.html !== 'null' ? group.schedule.html : `<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`;
    return { table };
};

export const select = (userId: number): { table: string } => {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    const options = [];
    const disabledOptions = [];

    for (const group of groups.all.values()) {
        if (group.name === user.info.groupName) {
            options.push(`<option selected value='${group.name}'>${group.name}</option>`);
        } else if (group.schedule.html === 'null') {
            disabledOptions.push(`<option disabled value='${group.name}'>${group.name}</option>`);
        } else {
            options.push(`<option value='${group.name}'>${group.name}</option>`);
        }
    }

    return { table: options.concat(disabledOptions).join('') };
};

export const update = (groupName: string): { table: string } => {
    const group = groups.getGroup(groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.schedule.html !== 'null' ? group.schedule.html : `<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`;
    return { table };
};