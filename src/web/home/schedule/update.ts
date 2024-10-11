import {bot} from "@index";
import config from "@config";

interface IQuery{
    group:string;
}

interface IResolve{
    table: string;
}

export default (query: IQuery): IResolve => {
    const group = bot.groups.getGroup(query.group);
    if (!group) return { table: config.notfoundMessagesSite.group };

    const table = group.schedule.html !== 'null' ? group.schedule.html : `<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`;
    return { table };
};