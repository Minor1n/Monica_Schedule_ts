import {Settings, SettingsI, SettingsType} from "./Settings";
import {connection} from "../index";
import {MysqlError} from "mysql";


export class SettingsAll {
    all: Map<SettingsType, Settings> = new Map();

    async load(): Promise<SettingsAll> {
        const settings = await querySQL.all();
        await Promise.all(
            settings.map(async (setting) => {
                const settingsInstance = new Settings();
                await settingsInstance.load(setting.type, setting);
                this.all.set(setting.type, settingsInstance);
            })
        );
        return this;
    }

    getSettings(type: SettingsType): Settings | undefined {
        return this.all.get(type);
    }
}

const querySQL = {
    all: (): Promise<SettingsI[]> => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM settings';
            connection.query(query, (err: MysqlError | null, result: SettingsI[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Settings'));
                } else {
                    resolve(result);
                }
            });
        });
    }
}