import {bot} from "../index";
import {MysqlError} from "mysql";
import {User} from "./User";
import {HtmlToImage} from "./HtmlToImage";
import {GroupSchedule} from "./GroupSchedule";
import {Settings} from "./Settings";
import {GroupDuty} from "./GroupDuty";
import {IGroup} from "../interfaces/IGroup";
import {IDuty} from "../interfaces/IDuty";
import payments from "../payments";
import {IUserQuery} from "../interfaces/IUserQuery";


interface IGroupQuery {
    name: string
    schedule: string
}

export class Group implements IGroup{
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
            let groupTg = groups ? await payments.groupIsPaid(user):true
            if(user.payment.status !== 0 && user.settings[settings] === 'on' && groupTg && user.info.id===6018898378){
                user.sendPhoto(img,name)
            }
        }
    }
}

const querySQL = {
    groups: async (groupName: string): Promise<IGroupQuery> => {
        return new Promise((resolve, reject) => {
            bot.connection.query(
                'SELECT * FROM groups WHERE name = ?',
                [groupName],
                (err: MysqlError | null, result: IGroupQuery[]) => {
                    if (err) {
                        reject(new Error('SQL ERROR in Group'));
                    } else {
                        resolve(result[0]);
                    }
                }
            );
        });
    },

    users: async (groupName: string): Promise<IUserQuery[]> => {
        return new Promise((resolve, reject) => {
            bot.connection.query(
                'SELECT * FROM users WHERE groupName = ?',
                [groupName],
                (err: MysqlError | null, result: IUserQuery[]) => {
                    if (err) {
                        reject(new Error('SQL ERROR in Group Users'));
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },

    duty: async (groupName: string): Promise<IDuty[]> => {
        return new Promise((resolve, reject) => {
            bot.connection.query(
                'SELECT * FROM duty WHERE `group` = ?',
                [groupName],
                (err: MysqlError | null, result: IDuty[]) => {
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