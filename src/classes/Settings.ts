import {connection} from "../index";
import {MysqlError} from "mysql";

export type SettingsType = 'scheduleLink'|'replacementLink'

export interface SettingsI{
    type:SettingsType
    value:string
    number:number
}

export class Settings implements SettingsI{
    type!:SettingsType
    private _value!:string
    private _number!:number
    constructor(type?: SettingsType, value?: string, number?: number) {
        if (type && value && number !== undefined) {
            this.type = type;
            this._value = value;
            this._number = number;
        }
    }

    async load(type: SettingsType, res?: SettingsI): Promise<Settings> {
        if (res) {
            this.type = type;
            this._value = res.value;
            this._number = res.number;
        } else {
            const settings = await querySQL.settings(type);
            this.type = settings.type;
            this._value = settings.value;
            this._number = settings.number;
        }
        return this;
    }

    get value(): string {
        return this._value;
    }

    set value(newValue: string) {
        this._value = newValue;
        this.updateSetting('value', newValue);
    }

    get number(): number {
        return this._number;
    }

    set number(newNumber: number) {
        this._number = newNumber;
        this.updateSetting('number', newNumber);
    }

    private updateSetting(column: 'value' | 'number', newValue: string | number): void {
        const query = `UPDATE settings SET ${column} = ? WHERE type = ?`;
        connection.query(query, [newValue, this.type], (err) => {
            if (err) {
                throw new Error('SQL ERROR in Settings - update');
            }
        });
    }
}

const querySQL = {
    settings: async (type: SettingsType): Promise<SettingsI> => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM settings WHERE type = ?';
            connection.query(query, [type], (err: MysqlError | null, result: SettingsI[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Settings - select'));
                } else if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    reject(new Error('No settings found for the given type'));
                }
            });
        });
    }
};