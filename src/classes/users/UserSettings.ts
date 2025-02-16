import {bot} from "@index";
import type IUserSettings from "@interfaces/IUserSettings";
import type {UserLightModeType, UserSettingsStatusType} from "@types";

export default class UserSettings implements IUserSettings{
    id:number;
    private _duty: UserSettingsStatusType;
    private _lightMode: UserLightModeType;
    private _replacement: UserSettingsStatusType;
    private _groupReplacement: UserSettingsStatusType;
    private _schedule: UserSettingsStatusType;
    private _theme:"standard"|string;
    constructor(id:number,duty:UserSettingsStatusType,lightMode:UserLightModeType,replacement:UserSettingsStatusType,groupReplacement:UserSettingsStatusType,schedule:UserSettingsStatusType,theme:"standard"|string) {
        this.id = id
        this._duty = duty
        this._lightMode = lightMode
        this._replacement = replacement
        this._groupReplacement = groupReplacement
        this._schedule = schedule
        this._theme = theme
    }
    get theme(): string {
        return this._theme;
    }

    get schedule(): UserSettingsStatusType {
        return this._schedule;
    }

    get replacement(): UserSettingsStatusType {
        return this._replacement;
    }

    get groupReplacement(): UserSettingsStatusType {
        return this._groupReplacement;
    }

    get lightMode(): UserLightModeType {
        return this._lightMode;
    }

    get duty(): UserSettingsStatusType {
        return this._duty;
    }

    private updateField(field: string, value: string | number) {
        const query = `UPDATE users SET ${field} = ? WHERE userId = ?`;
        bot.connection.query(query, [value, this.id], (err) => {
            if (err) {
                throw new Error('SQL ERROR in UserSettings');
            }
        });
    }

    set theme(value: string) {
        const isValidImage = /\.(jpeg|jpg|png)$/i.test(value);
        const newValue = value === 'standard' ? 'standard' : (isValidImage ? value : this._theme);
        this._theme = newValue;
        this.updateField('theme', newValue);
    }

    set schedule(value: UserSettingsStatusType) {
        this._schedule = value;
        this.updateField('settingsSchedule', value);
    }

    set replacement(value: UserSettingsStatusType) {
        this._replacement = value;
        this.updateField('settingsReplacement', value);
    }

    set groupReplacement(value: UserSettingsStatusType) {
        this._groupReplacement = value;
        this.updateField('settingsGroupReplacement', value);
    }

    set lightMode(value: UserLightModeType) {
        this._lightMode = value;
        this.updateField('lightMode', value);
    }

    set duty(value: UserSettingsStatusType) {
        this._duty = value;
        this.updateField('settingsDuty', value);
    }

    private switchStatus(currentStatus: UserSettingsStatusType): UserSettingsStatusType {
        return currentStatus === 'on' ? 'off' : 'on';
    }

    switchSchedule() {
        this._schedule = this.switchStatus(this._schedule);
        this.updateField('settingsSchedule', this._schedule);
    }

    switchReplacement() {
        this._replacement = this.switchStatus(this._replacement);
        this.updateField('settingsReplacement', this._replacement);
    }

    switchGroupReplacement() {
        this._groupReplacement = this.switchStatus(this._groupReplacement);
        this.updateField('settingsGroupReplacement', this._groupReplacement);
    }

    switchLightMode() {
        this._lightMode = this._lightMode === 0 ? 1 : 0;
        this.updateField('lightMode', this._lightMode);
    }

    switchDuty() {
        this._duty = this.switchStatus(this._duty);
        this.updateField('settingsDuty', this._duty);
    }
}