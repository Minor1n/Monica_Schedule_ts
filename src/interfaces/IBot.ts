import {Pool} from "mysql";
import {Gradients, Groups, Users} from "../classes";
import {Telegraf} from "telegraf";

export interface IBot extends Telegraf{
    connection: Pool
    gradients: Gradients;
    groups: Groups;
    users: Users;
}