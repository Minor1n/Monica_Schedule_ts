import {Pool} from "mysql";
import {Telegraf} from "telegraf";
import Gradients from "@classes/Gradients";
import Groups from "@classes/groups/Groups";
import Users from "@classes/users/Users";
import IContext from "@interfaces/IContext";

export default interface IBot extends Telegraf<IContext<any>>{
    connection: Pool
    gradients: Gradients;
    groups: Groups;
    users: Users;
}