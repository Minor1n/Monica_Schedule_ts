import {UserDutyDayType, UserLightModeType, UserRoleType, UserSettingsStatusType} from "@interfaces/Types";

export default interface IUserQuery {
    groupName:string;
    userId:number;
    userName:string;
    payment:number;
    price:number;
    name:string;
    role:UserRoleType;
    dutyCount:number;
    dutyLastDate:number;
    dutyDay:UserDutyDayType;
    settingsSchedule:UserSettingsStatusType;
    settingsReplacement:UserSettingsStatusType;
    settingsGroupReplacement:UserSettingsStatusType;
    settingsDuty:UserSettingsStatusType;
    theme:string;
    refKey:string;
    paidWhenever:'true'|'false';
    lightMode:UserLightModeType;
    groupBots:number;
}