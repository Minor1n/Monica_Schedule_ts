import {Context} from "telegraf";

export default interface ICommand {
    name: string;
    execute: (ctx:Context) => void;
}