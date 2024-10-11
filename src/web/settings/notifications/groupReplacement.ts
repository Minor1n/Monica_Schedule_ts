import {bot} from "@index";
import config from "@config";

interface IQuery {
    user: string;
}

interface IResolve{
    table: string;
}

export default (query:IQuery): IResolve|void => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return { table: config.notfoundMessagesSite.user };
    user.settings.switchGroupReplacement();
}