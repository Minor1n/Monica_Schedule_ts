import {bot} from "../../../index";
import {config} from "../../../config";

export default (userId: number, url: string) => {
    const user = bot.users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    user.settings.theme = url;
};