import UserInfo from "@classes/users/UserInfo";
import UserDuty from "@classes/users/UserDuty";
import UserPayment from "@classes/users/UserPayment";
import UserSettings from "@classes/users/UserSettings";

export default interface IUser{
    info: UserInfo
    duty: UserDuty
    payment: UserPayment
    settings: UserSettings
}