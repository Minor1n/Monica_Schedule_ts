import {bot, connection} from "../index";
import {UserInfo} from './UserInfo'
import {UserDuty} from "./UserDuty";
import {UserPayment} from "./UserPayment";
import {UserSettings} from "./UserSettings";
import {UserReferral} from "./UserReferral";
import {MysqlError} from "mysql";
import {Input} from "telegraf";
import {Functions} from "../functions";

export type UserRole = 'headman'|'user'|'support'|'admin'|'group'
export type UserDutyDay = -1|1|2|3|4|5|6
export type UserSettingsStatus = "on" | "off"
export type UserLightMode = 0 | 1

export type UserT = {
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

export interface UserI{
    info: UserInfo
    duty: UserDuty
    payment: UserPayment
    settings: UserSettings
}

export class User implements UserI{
    duty!:UserDuty
    payment!:UserPayment
    settings!:UserSettings
    info!:UserInfo

    constructor(){}
    async load(userId:number, options?:{res?: UserT,refKey?:string }):Promise<User>{
        const user = options?.res ? options.res :
            options?.refKey ? await querySQL.refKey(options.refKey) : await querySQL.userId(userId);

        const { settings, info, duty, payment } = await this.loadOptions(user);

        this.settings = settings;
        this.info = info;
        this.duty = duty;
        this.payment = payment;

        return this;
    }

    private async loadOptions(result: UserT): Promise<UserI> {
        const referral = await new UserReferral(result.userId, result.refKey).load();
        return {
            duty: new UserDuty(result.userId, result.dutyCount, result.dutyDay, result.dutyLastDate),
            info: new UserInfo(result.groupBots, result.groupName, result.userId, result.name, result.userName, result.role),
            payment: new UserPayment(result.userId, result.paidWhenever, result.price, result.payment, referral),
            settings: new UserSettings(result.userId, result.settingsDuty, result.lightMode, result.settingsReplacement, result.settingsSchedule, result.theme),
        };
    }

    sendText(text:string){
        bot.telegram.sendMessage(this.info.id,text,{ parse_mode: 'HTML' }).catch(e=>{console.log(e)})
        Functions.payment.alert(this).catch(e=>{console.log(e)})
    }
    sendAutoDeleteText(text:string,timeout:number){
        bot.telegram.sendMessage(this.info.id,text,{ parse_mode: 'HTML' })
            .then(r=>{setTimeout(()=>{bot.telegram.deleteMessage(r.chat.id,r.message_id).catch(e=>{console.log(e)})},timeout)})
            .catch(e=>{console.log(e)})
        Functions.payment.alert(this).catch(e=>{console.log(e)})
    }
    sendPhoto(image:Buffer,name:string){
        bot.telegram.sendPhoto(this.info.id, Input.fromBuffer(image,name)).catch(e=>{console.log(e)})
        Functions.payment.alert(this).catch(e=>{console.log(e)})
    }
}

const querySQL = {
    refKey: async (refKey: string): Promise<UserT> => {
        return queryDatabase(`SELECT * FROM users WHERE refKey = ?`, [refKey]);
    },
    userId: async (userId: number): Promise<UserT> => {
        return queryDatabase(`SELECT * FROM users WHERE userId = ?`, [userId]);
    }
};

async function queryDatabase(query: string, values: any[]): Promise<UserT> {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err: MysqlError | null, result: UserT[]) => {
            if (err) {
                return reject(new Error('SQL ERROR'));
            }
            if (result[0]) {
                resolve(result[0]);
            } else {
                reject(new Error('USER not found'));
            }
        });
    });
}