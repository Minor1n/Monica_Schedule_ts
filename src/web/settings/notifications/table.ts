import {bot} from "../../../index";
import {config} from "../../../config";
import generateTable from "./generateTable";

export default (userId: number): { table: string } => {
    const user = bot.users.getUser(userId);
    return user ? { table: generateTable(user) } : { table: config.notfoundMessagesSite.user };
}