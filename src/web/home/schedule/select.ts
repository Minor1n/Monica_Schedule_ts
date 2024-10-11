import {bot} from "@index";
import config from "@config";

interface IQuery{
    user:string;
}

interface IResolve{
    table: string;
}

export default (query:IQuery): IResolve => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return { table: config.notfoundMessagesSite.user };

    const options = [];
    const disabledOptions = [];

    for (const group of bot.groups.all.values()) {
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