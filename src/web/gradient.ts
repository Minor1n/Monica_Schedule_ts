import {bot} from "../index";


export default (userId: number): { gradient: string } => {
    const user = bot.users.getUser(userId);
    if (!user) return { gradient: bot.gradients.light.slice(11, -1) };

    const { theme, lightMode } = user.settings;
    const gradient = lightMode === 0 ? bot.gradients.light : bot.gradients.dark;

    return { gradient: theme === 'standard' ? gradient.slice(11, -1) : `url(${theme})` };
};