import {Pool} from "mysql";
import {Telegraf} from "telegraf";
import Gradients from "@classes/Gradients";
import Groups from "@classes/groups/Groups";
import Users from "@classes/users/Users";

export default interface IBot extends Telegraf{
    connection: Pool
    gradients: Gradients;
    groups: Groups;
    users: Users;
}