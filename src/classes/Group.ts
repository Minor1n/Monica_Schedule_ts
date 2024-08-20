import {connection} from "../index";
import {MysqlError} from "mysql";
import {User, UserT} from "./User";
import {Functions} from "../functions";
import {HtmlToImage} from "./HtmlToImage";
import {GroupSchedule} from "./GroupSchedule";
import {Settings} from "./Settings";
import {GroupDuty} from "./GroupDuty";

export interface DutyI{
    group:string
    date:number
    user:number
    name:string
}

export type GroupT = {
    name: string
    schedule: string
}

export interface GroupI{
    name: string
    schedule: GroupSchedule
    users:User[]
    duty:GroupDuty
}

export class Group implements GroupI{
    name!: string;
    schedule!: GroupSchedule;
    private _users!:User[]
    private _duty!:GroupDuty
    constructor() {}
    async load(groupName:string,schedule?:string):Promise<Group>{
        let q = !schedule ? await querySQL.groups(groupName) : {name:groupName,schedule:schedule}
        this.name = q.name
        this.schedule = new GroupSchedule(this.name,q.schedule,(await new Settings().load('scheduleLink')).value)
        let users = await querySQL.users(groupName)
        let duty = await querySQL.duty(groupName)
        this._users = await Promise.all(users.map(async (x)=>new User().load(x.userId,x)))
        this._duty = new GroupDuty(this.name,this.users,duty)
        return this
    }
    get users(){
        return this._users
    }
    get duty(){
        return this._duty
    }
    // getUser(userId:number):User|undefined{
    //     return this._users.find(x=>x.info.id === userId)
    // }

    async sendPhoto(image:Buffer,name:string,settings:'duty'|'schedule'|'replacement',groups:boolean,html?:string){
        for(let user of this._users){
            let gradient = user.settings.theme
            let img = html&&gradient!=='standard'? await new HtmlToImage(gradient,html).getImage():image
            let groupTg = groups ? await Functions.payment.groupTG(user):true
            if(user.payment.status !== 0 && user.settings[settings] === 'on' && groupTg && user.info.id===6018898378){
                user.sendPhoto(img,name)
            }
        }
    }
}

const querySQL = {
    groups: async (groupName: string): Promise<GroupT> => {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM groups WHERE name = ?',
                [groupName],
                (err: MysqlError | null, result: GroupT[]) => {
                    if (err) {
                        reject(new Error('SQL ERROR in Group'));
                    } else {
                        resolve(result[0]);
                    }
                }
            );
        });
    },

    users: async (groupName: string): Promise<UserT[]> => {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM users WHERE groupName = ?',
                [groupName],
                (err: MysqlError | null, result: UserT[]) => {
                    if (err) {
                        reject(new Error('SQL ERROR in Group Users'));
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },

    duty: async (groupName: string): Promise<DutyI[]> => {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM duty WHERE `group` = ?',
                [groupName],
                (err: MysqlError | null, result: DutyI[]) => {
                    if (err) {
                        reject(new Error('SQL ERROR in Group Duty'));
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }
};