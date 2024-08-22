import {UserDuty, UserInfo, UserPayment, UserSettings} from "../classes";

export interface IUser{
    info: UserInfo
    duty: UserDuty
    payment: UserPayment
    settings: UserSettings
}