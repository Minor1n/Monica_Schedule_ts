import {IGroup} from "./IGroup";

export interface IReplacementParse {
    text: string;
    group: IGroup|null;
    pair: string|undefined;
    auditorium: string;
}