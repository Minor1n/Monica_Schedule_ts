import {bot} from "../../../index";
interface ISettings{
    duty:'on'|'off'
    replacement:'on'|'off'
    schedule:'on'|'off'
}

export default (userId: number): ISettings|void => {
    const user = bot.users.getUser(userId);
    if (!user) return;
    return {
        duty:user.settings.duty,
        schedule:user.settings.schedule,
        replacement:user.settings.replacement
    };
}