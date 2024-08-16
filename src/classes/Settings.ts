import {connection} from "../index";
import {MysqlError} from "mysql";

type SettingsType = 'meme'|'price'|'host'|'week'|'fixPrice'|'agentCost'|'scheduleLink'|'replacementLink'

interface SettingsI{
    type:SettingsType
    value:string
    number:number
}

export class Settings implements SettingsI{
    type!:SettingsType
    private _value!:string
    private _number!:number
    constructor() {}
    async load(type:SettingsType,res?:SettingsI):Promise<Settings>{
        if(res){
            this.type = type
            this._value = res.value
            this._number = res.number
        }else{
            let settings = await querySQL.settings(type)
            this.type = settings.type
            this._value = settings.value
            this._number = settings.number
        }
        return this
    }
    get value(){
        return this._value
    }
    get number(){
        return this._number
    }

    set value(value){
        this._value = value
        connection.query(`UPDATE settings SET value = '${value}' WHERE type = '${this.type}'`)
    }
    set number(value){
        this._number = value
        connection.query(`UPDATE settings SET number = '${value}' WHERE type = '${this.type}'`)
    }
}

export class SettingsAll{
    all!:Settings[]
    constructor() {}
    async load():Promise<SettingsAll>{
        let settings = await querySQL.all()
        this.all = await Promise.all(settings.map(async (x)=>new Settings().load(x.type,x)))
        return this
    }
    getSettings(type:SettingsType){
        return this.all.find(x=>x.type === type)
    }
}

const querySQL={
    settings: async(type:SettingsType):Promise<SettingsI>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM settings WHERE type = '${type}'`, (err:MysqlError|null, result:SettingsI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Settings')
                }else{
                    resolve(result[0])
                }
            })
        })
    },
    all: async():Promise<SettingsI[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM settings`, async (err:MysqlError|null, result:SettingsI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Settings')
                }else{
                    resolve(result)
                }
            })
        })
    }
}