import {bot} from "../../../index";
import {config} from "../../../config";
import generateTable from "./generateTable";

export default (userId: number): { table: string } => {
    const user = bot.users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };
    user.settings.switchReplacement();
    return { table: generateTable(user) };
}