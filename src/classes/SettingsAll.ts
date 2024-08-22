import {Settings} from "./Settings";
import {bot} from "../index";
import {MysqlError} from "mysql";
import {ISettings, SettingsType} from "../interfaces/ISettings";


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
    all: (): Promise<ISettings[]> => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM settings';
            bot.connection.query(query, (err: MysqlError | null, result: ISettings[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Settings'));
                } else {
                    resolve(result);
                }
            });
        });
    }
}