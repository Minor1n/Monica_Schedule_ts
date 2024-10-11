import {bot} from "@index";
import config from "@config";

interface IQuery{
    user:string;
}

interface IResolve{
    table: string;
}

export default (query:IQuery): IResolve =>{
    const user = bot.users.getUser(Number(query.user));
    if (!user) return { table: config.notfoundMessagesSite.user };

    const group = bot.groups.getGroup(user.info.groupName);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.replacement.html !== 'null' ? group.replacement.html : `<tr><td><b>Замены для вашей группы не найдены!</b></td></tr>`;
    return { table };
}