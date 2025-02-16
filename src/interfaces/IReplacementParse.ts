import type IGroup from "@interfaces/IGroup";

export default interface IReplacementParse {
    text: string;
    group: IGroup|null;
    pair: string|undefined;
    auditorium: string;
}