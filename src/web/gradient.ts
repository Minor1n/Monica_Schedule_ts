import {bot} from "@index";

interface IQuery {
    user: string;
}

interface IResolve {
    gradient: string;
}

export default (query:IQuery): IResolve => {
    const user = bot.users.getUser(Number(query.user));
    if (!user) return { gradient: bot.gradients.light.slice(11, -1) };

    const { theme, lightMode } = user.settings;
    const gradient = lightMode === 0 ? bot.gradients.light : bot.gradients.dark;

    return { gradient: theme === 'standard' ? gradient.slice(11, -1) : `url(${theme})` };
};