import {bot} from "@index";

interface IQuery {
    user: string;
}

interface IResolve{
    lightMode:0|1;
}

export default (query:IQuery): IResolve => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return {lightMode:0};
    return {lightMode:user.settings.lightMode};
};