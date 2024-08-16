import {connection} from "../index";
import {UserLightMode, UserSettingsStatus} from "./User";

interface UserSettingsI{
    id:number;
    schedule:UserSettingsStatus;
    replacement:UserSettingsStatus;
    duty:UserSettingsStatus;
    theme:"standard"|string;
    lightMode:UserLightMode
}

export class UserSettings implements UserSettingsI{
    id:number;
    private _duty: UserSettingsStatus;
    private _lightMode: UserLightMode;
    private _replacement: UserSettingsStatus;
    private _schedule: UserSettingsStatus;
    private _theme:"standard"|string;
    constructor(id:number,duty:UserSettingsStatus,lightMode:UserLightMode,replacement:UserSettingsStatus,schedule:UserSettingsStatus,theme:"standard"|string) {
        this.id = id
        this._duty = duty
        this._lightMode = lightMode
        this._replacement = replacement
        this._schedule = schedule
        this._theme = theme
    }
    get theme(): string {
        return this._theme;
    }
    get schedule(): UserSettingsStatus {
        return this._schedule;
    }
    get replacement(): UserSettingsStatus {
        return this._replacement;
    }
    get lightMode(): UserLightMode {
        return this._lightMode;
    }
    get duty(): UserSettingsStatus {
        return this._duty;
    }

    set theme(value: string) {
        let url = value.match(/\.(jpeg|jpg|png)$/) != null?value:this._theme
        let res = value === 'standard'?'standard':url;
        this._theme = res
        connection.query(`UPDATE users SET theme = '${res}' WHERE userId = '${this.id}'`)
    }
    set schedule(value: UserSettingsStatus) {
        this._schedule = value;
        connection.query(`UPDATE users SET settingsSchedule = '${value}' WHERE userId = '${this.id}'`)
    }
    set replacement(value: UserSettingsStatus) {
        this._replacement = value;
        connection.query(`UPDATE users SET settingsReplacement = '${value}' WHERE userId = '${this.id}'`)
    }
    set lightMode(value: UserLightMode) {
        this._lightMode = value;
        connection.query(`UPDATE users SET lightMode = '${value}' WHERE userId = '${this.id}'`)
    }
    set duty(value: UserSettingsStatus) {
        this._duty = value;
        connection.query(`UPDATE users SET settingsDuty = '${value}' WHERE userId = '${this.id}'`)
    }

    switchSchedule() {
        let status:UserSettingsStatus = this._schedule==='on'?'off':'on'
        this._schedule = status;
        connection.query(`UPDATE users SET settingsSchedule = '${status}' WHERE userId = '${this.id}'`)
    }
    switchReplacement() {
        let status:UserSettingsStatus = this._replacement==='on'?'off':'on'
        this._replacement = status;
        connection.query(`UPDATE users SET settingsReplacement = '${status}' WHERE userId = '${this.id}'`)
    }
    switchLightMode() {
        let status: UserLightMode = this._lightMode===0?1:0
        this._lightMode = status;
        connection.query(`UPDATE users SET lightMode = '${status}' WHERE userId = '${this.id}'`)
    }
    switchDuty() {
        let status:UserSettingsStatus = this._duty==='on'?'off':'on'
        this._duty = status;
        connection.query(`UPDATE users SET settingsDuty = '${status}' WHERE userId = '${this.id}'`)
    }
}