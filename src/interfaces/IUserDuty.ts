import {UserDutyDayType} from "@interfaces/Types";

export default interface IUserDuty {
    id:number;
    count:number;
    day:UserDutyDayType|number;
    lastDate:number;
}