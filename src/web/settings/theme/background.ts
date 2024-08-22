import {bot} from "../../../index";
import {config} from "../../../config";
import generateTable from "./generateTable";

export default (userId: number, url: string): { table: string } => {
    const user = bot.users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    user.settings.theme = url;
    return { table: generateTable(user) };
};