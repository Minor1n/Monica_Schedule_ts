import {gradients, users} from "../index";


export const gradient = (userId: number): { gradient: string } => {
    const user = users.getUser(userId);
    if (!user) return { gradient: gradients.light.slice(11, -1) };

    const { theme, lightMode } = user.settings;
    const gradient = lightMode === 0 ? gradients.light : gradients.dark;

    return { gradient: theme === 'standard' ? gradient.slice(11, -1) : `url(${theme})` };
};