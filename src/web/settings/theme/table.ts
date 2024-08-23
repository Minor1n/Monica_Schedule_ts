import {bot} from "../../../index";

export default (userId: number):{lightMode:0|1}|void => {
    const user = bot.users.getUser(userId);
    if (!user) return;
    return {lightMode:user.settings.lightMode};
};