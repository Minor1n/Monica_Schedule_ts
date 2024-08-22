export type UserRole = 'headman'|'user'|'support'|'admin'|'group'
export type UserDutyDay = -1|1|2|3|4|5|6
export type UserSettingsStatus = "on" | "off"
export type UserLightMode = 0 | 1

export interface IUserQuery {
    groupName:string;
    userId:number;
    userName:string;
    payment:number;
    price:number;
    name:string;
    role:UserRole;
    dutyCount:number;
    dutyLastDate:number;
    dutyDay:UserDutyDay;
    settingsSchedule:UserSettingsStatus;
    settingsReplacement:UserSettingsStatus;
    settingsDuty:UserSettingsStatus;
    theme:string;
    refKey:string;
    paidWhenever:'true'|'false';
    lightMode:UserLightMode;
    groupBots:number;
}