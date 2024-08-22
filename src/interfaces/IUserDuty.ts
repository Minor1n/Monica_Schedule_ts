import {UserDutyDay} from "./IUserQuery";

export interface IUserDuty {
    id:number;
    count:number;
    day:UserDutyDay|number;
    lastDate:number;
}