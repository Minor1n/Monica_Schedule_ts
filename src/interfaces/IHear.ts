import {Context} from "telegraf";

export default interface IHear {
    name: string;
    execute: (ctx:Context) => void;
}