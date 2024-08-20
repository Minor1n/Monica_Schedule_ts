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

    private updateField(field: string, value: string | number) {
        const query = `UPDATE users SET ${field} = ? WHERE userId = ?`;
        connection.query(query, [value, this.id], (err) => {
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

    set schedule(value: UserSettingsStatus) {
        this._schedule = value;
        this.updateField('settingsSchedule', value);
    }

    set replacement(value: UserSettingsStatus) {
        this._replacement = value;
        this.updateField('settingsReplacement', value);
    }

    set lightMode(value: UserLightMode) {
        this._lightMode = value;
        this.updateField('lightMode', value);
    }

    set duty(value: UserSettingsStatus) {
        this._duty = value;
        this.updateField('settingsDuty', value);
    }

    private switchStatus(currentStatus: UserSettingsStatus): UserSettingsStatus {
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

    switchLightMode() {
        this._lightMode = this._lightMode === 0 ? 1 : 0;
        this.updateField('lightMode', this._lightMode);
    }

    switchDuty() {
        this._duty = this.switchStatus(this._duty);
        this.updateField('settingsDuty', this._duty);
    }
}