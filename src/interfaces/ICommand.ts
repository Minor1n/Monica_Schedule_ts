import IContext from "@interfaces/IContext";

export default interface ICommand {
    name: string;
    execute: (ctx:IContext<any>) => void;
}