import {bot} from "@index";
import {MysqlError} from "mysql";
import {Input} from "telegraf";
import {InlineKeyboardButton} from '@telegraf/types'
import UserInfo from './UserInfo'
import UserDuty from "./UserDuty";
import UserPayment from "./UserPayment";
import UserSettings from "./UserSettings";
import UserReferral from "./UserReferral";
import IUserQuery from "@interfaces/IUserQuery";
import IUser from "@interfaces/IUser";
import {payments} from "@utils";

export default class User implements IUser{
    duty!:UserDuty
    payment!:UserPayment
    settings!:UserSettings
    info!:UserInfo

    constructor(){}
    async load(userId:number, options?:{res?: IUserQuery,refKey?:string }):Promise<User>{
        const user = options?.res ? options.res :
            options?.refKey ? await querySQL.refKey(options.refKey) : await querySQL.userId(userId);

        const { settings, info, duty, payment } = await this.loadOptions(user);

        this.settings = settings;
        this.info = info;
        this.duty = duty;
        this.payment = payment;

        return this;
    }

    private async loadOptions(result: IUserQuery): Promise<IUser> {
        const referral = await new UserReferral(result.userId, result.refKey).load();
        return {
            duty: new UserDuty(result.userId, result.dutyCount, result.dutyDay, result.dutyLastDate),
            info: new UserInfo(result.groupBots, result.groupName, result.userId, result.name, result.userName, result.role, result.banStatus),
            payment: new UserPayment(result.userId, result.paidWhenever, result.price, result.payment, referral),
            settings: new UserSettings(result.userId, result.settingsDuty, result.lightMode, result.settingsReplacement,
                result.settingsGroupReplacement, result.settingsSchedule, result.theme),
        };
    }

    sendText(text:string,devMode:boolean = true){
        if(bot.devMode&&this.info.id !== 6018898378&&devMode)return;
        bot.telegram.sendMessage(this.info.id,text,{ parse_mode: 'HTML' }).then(()=>{
            this.unbanStatus()
        }).catch(e=>{
            this.banStatus(e)
            console.log(e)
        })
        payments.alert(this).catch(e=>{console.log(e)})
    }
    sendAutoDeleteText(text:string,timeout:number){
        bot.telegram.sendMessage(this.info.id,text,{ parse_mode: 'HTML' })
            .then(r=>{setTimeout(()=>{
                bot.telegram.deleteMessage(r.chat.id,r.message_id).then(()=>{
                    this.unbanStatus()
                }).catch(e=>{
                    this.banStatus(e)
                    console.log(e)
                })},timeout
            )}).then(()=>{
            this.unbanStatus()
            })
            .catch(e=>{
                this.banStatus(e)
                console.log(e)
            })
        payments.alert(this).catch(e=>{console.log(e)})
    }
    sendPhoto(image:Buffer,name:string){
        bot.telegram.sendPhoto(this.info.id, Input.fromBuffer(image,name)).then(()=>{
            this.unbanStatus()
        }).catch(e=>{
            this.banStatus(e)
            console.log(e)
        })
        payments.alert(this).catch(e=>{console.log(e)})
    }
    sendButtons(text:string,keyboard:InlineKeyboardButton[][]){
        bot.telegram.sendMessage(this.info.id,text,{
            reply_markup: {
                inline_keyboard: keyboard,
            },
        }).then(()=>{
            this.unbanStatus()
        }).catch(e=>{
            this.banStatus(e)
            console.log(e)
        })
    }

    private banStatus(e:any){
        if(this.info.banStatus === 'false'){
            if(e.code === 403){
                this.info.banStatus = 'true';
                bot.users.getUser(6018898378)?.sendText(`Пользователь: ${this.info.name}(${this.info.id}, ${this.info.userName}) заблокировал бота`)
            }
        }
    }

    private unbanStatus(){
        if(this.info.banStatus === 'true'){
            this.info.banStatus = 'false';
            bot.users.getUser(6018898378)?.sendText(`Пользователь: ${this.info.name}(${this.info.id}, ${this.info.userName}) разблокировал бота`)
        }
    }
}

const querySQL = {
    refKey: async (refKey: string): Promise<IUserQuery> => {
        return queryDatabase(`SELECT * FROM users WHERE refKey = ?`, [refKey]);
    },
    userId: async (userId: number): Promise<IUserQuery> => {
        return queryDatabase(`SELECT * FROM users WHERE userId = ?`, [userId]);
    }
};

async function queryDatabase(query: string, values: any[]): Promise<IUserQuery> {
    return new Promise((resolve, reject) => {
        bot.connection.query(query, values, (err: MysqlError | null, result: IUserQuery[]) => {
            if (err) {
                return reject(new Error(`SQL ERROR ${err}`));
            }
            if (result[0]) {
                resolve(result[0]);
            } else {
                reject(new Error('USER not found'));
            }
        });
    });
}