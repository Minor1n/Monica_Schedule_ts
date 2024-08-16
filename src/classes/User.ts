import {connection} from "../index";
import {UserInfo} from './UserInfo'
import {UserDuty} from "./UserDuty";
import {Payment} from "./Payment";
import {UserSettings} from "./UserSettings";
import {UserReferral} from "./UserReferral";
import {MysqlError} from "mysql";

export type UserT = {
    groupName:string;
    userId:number;
    userName:string;
    payment:number;
    price:number;
    name:string;
    role:'headman'|'user'|'support'|'admin'|'group';
    duty:number;
    dutyDate:number;
    scheduleDate:-1|1|2|3|4|5|6;
    settingsMeme:"on" | "off" ;
    settingsSchedule:"on" | "off" ;
    settingsReplacement:"on" | "off" ;
    settingsDuty:"on" | "off" ;
    theme:string;
    refKey:string;
    refAgents:number;
    refKeyStatus:'true'|'false';
    paidWhenever:'true'|'false';
    lightMode:0 | 1;
    groupBots:number;
}

interface UserI{
    info: UserInfo
    duty: UserDuty
    payment: Payment
    settings: UserSettings
}

export class User implements UserI{
    duty!:UserDuty
    payment!:Payment
    settings!:UserSettings
    info!:UserInfo

    constructor(){}
    async load(userId:number, options?:{res?: UserT,refKey?:string }):Promise<User>{
        if(options?.res) {
            let l = await loadOptions(options.res)
            this.settings = l.settings
            this.info = l.info
            this.duty = l.duty
            this.payment = l.payment
            return this
        }else if(options?.refKey){
            let q = await querySQL.refKey(options.refKey)
            let l = await loadOptions(q)
            this.settings = l.settings
            this.info = l.info
            this.duty = l.duty
            this.payment = l.payment
            return this
        }else{
            let q = await querySQL.userId(userId)
            let l = await loadOptions(q)
            this.settings = l.settings
            this.info = l.info
            this.duty = l.duty
            this.payment = l.payment
            return this
        }
        async function loadOptions(result:UserT):Promise<UserI>{
            let referral = await new UserReferral(userId,result.refAgents,result.refKey,result.refKeyStatus).load()
            return{
                duty: new UserDuty(userId,result.duty,result.scheduleDate,result.dutyDate),
                info: new UserInfo(result.groupBots,result.groupName,userId,result.name,result.userName,result.role),
                payment: new Payment(userId,result.paidWhenever,result.price,result.payment,referral),
                settings: new UserSettings(userId,result.settingsDuty,result.lightMode,result.settingsReplacement,result.settingsSchedule,result.theme)
            }
        }
    }
}

export class Users{
    all!:User[]
    constructor() {}
    async createUser(userId:number,userName:string,payment:number,name:string,refKey:string){
        connection.query(`INSERT INTO users (userId,userName,payment,name,refKey) values('${userId}','${userName}','${payment}','${name}','${refKey}')`,async (err, result: UserT[]) => {
            if (err) {
                throw new Error('SQL ERROR in Users')
            } else {
                this.all.push(await new User().load(userId, {res: result[0]}))
            }
        })
    }
    getUser(userId:number){
        return this.all.find(x=>x.info.id===userId)
    }
    async load():Promise<Users>{
        let q = await querySQL.all()
        this.all = await Promise.all(q.map(async (x) =>await new User().load(x.userId, x)))
        return this
    }
}

const querySQL={
    refKey: async (refKey:string):Promise<UserT>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM users WHERE refKey = '${refKey}'`, async (err: MysqlError | null, result:UserT[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Users')
                }else if (result[0]) {
                    resolve(result[0])
                } else {
                    throw new Error('USER not found')
                }
            })
        })
    },
    userId: async (userId:number):Promise<UserT>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM users WHERE userId = '${userId}'`, async (err: MysqlError | null, result: UserT[]) => {
                if (err) {
                    throw new Error('SQL ERROR in USER')
                } else if (result[0]) {
                    resolve(result[0])
                } else {
                    throw new Error('USER not found')
                }
            })
        })
    },
    all: async ():Promise<UserT[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query('SELECT * FROM users', async (err: MysqlError | null, result:UserT[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Users')
                }else{
                    resolve(result)
                }
            })
        })
    }
}