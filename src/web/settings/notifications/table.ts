import {bot} from "@index";

interface IQuery {
    user: string;
}

interface IResolve{
    duty:'on'|'off'
    replacement:'on'|'off'
    schedule:'on'|'off'
    groupReplacement:'on'|'off'
}

export default (query:IQuery): IResolve|void => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return;
    return {
        duty:user.settings.duty,
        schedule:user.settings.schedule,
        replacement:user.settings.replacement,
        groupReplacement:user.settings.groupReplacement
    };
}