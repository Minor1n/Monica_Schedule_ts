import {UserLightModeType, UserSettingsStatusType} from "@interfaces/Types";

export default interface IUserSettings{
    id:number;
    schedule:UserSettingsStatusType;
    replacement:UserSettingsStatusType;
    duty:UserSettingsStatusType;
    groupReplacement: UserSettingsStatusType;
    theme:"standard"|string;
    lightMode:UserLightModeType
}