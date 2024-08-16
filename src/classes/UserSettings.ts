import {connection} from "../index";

interface UserSettingsI{
    id:number;
    schedule:'on'|'off';
    replacement:'on'|'off';
    duty:'on'|'off';
    theme:"standard"|string;
    lightMode:0|1
}

export class UserSettings implements UserSettingsI{
    id:number;
    private _duty: "on" | "off";
    private _lightMode: 0 | 1;
    private _replacement: "on" | "off";
    private _schedule: "on" | "off";
    private _theme:"standard"|string;
    constructor(id:number,duty:"on" | "off",lightMode:0 | 1,replacement:"on" | "off",schedule:"on" | "off",theme:"standard"|string) {
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
    get schedule(): "on" | "off" {
        return this._schedule;
    }
    get replacement(): "on" | "off" {
        return this._replacement;
    }
    get lightMode(): 0 | 1 {
        return this._lightMode;
    }
    get duty(): "on" | "off" {
        return this._duty;
    }

    set theme(value: string) {
        let url = value.match(/\.(jpeg|jpg|png)$/) != null?value:this._theme
        let res = value === 'standard'?'standard':url;
        this._theme = res
        connection.query(`UPDATE users SET theme = '${res}' WHERE userId = '${this.id}'`)
    }
    set schedule(value: "on" | "off") {
        this._schedule = value;
        connection.query(`UPDATE users SET settingsSchedule = '${value}' WHERE userId = '${this.id}'`)
    }
    set replacement(value: "on" | "off") {
        this._replacement = value;
        connection.query(`UPDATE users SET settingsReplacement = '${value}' WHERE userId = '${this.id}'`)
    }
    set lightMode(value: 0 | 1) {
        this._lightMode = value;
        connection.query(`UPDATE users SET lightMode = '${value}' WHERE userId = '${this.id}'`)
    }
    set duty(value: "on" | "off") {
        this._duty = value;
        connection.query(`UPDATE users SET settingsDuty = '${value}' WHERE userId = '${this.id}'`)
    }

    switchSchedule() {
        let status:'on'|'off' = this._schedule==='on'?'off':'on'
        this._schedule = status;
        connection.query(`UPDATE users SET settingsSchedule = '${status}' WHERE userId = '${this.id}'`)
    }
    switchReplacement() {
        let status:'on'|'off' = this._replacement==='on'?'off':'on'
        this._replacement = status;
        connection.query(`UPDATE users SET settingsReplacement = '${status}' WHERE userId = '${this.id}'`)
    }
    switchLightMode() {
        let status:0|1 = this._lightMode===0?1:0
        this._lightMode = status;
        connection.query(`UPDATE users SET lightMode = '${status}' WHERE userId = '${this.id}'`)
    }
    switchDuty() {
        let status:'on'|'off' = this._duty==='on'?'off':'on'
        this._duty = status;
        connection.query(`UPDATE users SET settingsDuty = '${status}' WHERE userId = '${this.id}'`)
    }
}