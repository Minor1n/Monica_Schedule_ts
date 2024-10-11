import {TrueFalseType} from "@interfaces/Types";

export default interface ISessionQuery {
    authorid: number;
    users: number;
    joinable: TrueFalseType;
}