import {UserLightMode, UserSettingsStatus} from "./IUserQuery";

export interface IUserSettings{
    id:number;
    schedule:UserSettingsStatus;
    replacement:UserSettingsStatus;
    duty:UserSettingsStatus;
    theme:"standard"|string;
    lightMode:UserLightMode
}