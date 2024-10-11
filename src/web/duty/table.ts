import {bot} from "@index";
import config from "@config";

interface IQuery{
    user:string;
    page:string;
}

interface IResolve{
    table: string;
}

export default (query:IQuery): IResolve => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return { table: config.notfoundMessagesSite.user };

    const group = bot.groups.getGroup(user.info.groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.duty.generateHTML(Number(query.page));
    return { table };
};