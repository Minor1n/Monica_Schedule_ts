import {bot} from "@index";

interface IQuery {
    user: string;
}

interface IResolve{
    lightMode:0|1;
}

export default (query:IQuery): IResolve|void => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return;
    return {lightMode:user.settings.lightMode};
};