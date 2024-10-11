import {bot} from "@index";
import {MysqlError} from "mysql";
import HtmlToImage from "@classes/HtmlToImage";
import Settings from "@classes/settings/Settings";
import GroupSchedule from "./GroupSchedule";
import GroupDuty from "./GroupDuty";
import GroupReplacement from "./GroupReplacement";
import IGroup from "@interfaces/IGroup";
import IDuty from "@interfaces/IDuty";
import IGroupQuery from "@interfaces/IGroupQuery";
import {UserSettingsType} from "@types";
import {payments} from "@utils";

export default class Group implements IGroup{
    name!: string;
    schedule!: GroupSchedule;
    replacement!:GroupReplacement;
    private _duty!:GroupDuty
    constructor() {}
    async load(groupName:string,schedule?:string,replacement?:string):Promise<Group>{
        let q = !schedule||!replacement ? await querySQL.groups(groupName):{schedule,replacement,name:groupName}
        this.name = q.name
        this.schedule = new GroupSchedule(this.name,q.schedule,(await new Settings().load('scheduleLink')).value)
        this.replacement = new GroupReplacement(this.name,q.replacement,(await new Settings().load('replacementLink')).value)
        let duty = await querySQL.duty(groupName)
        this._duty = new GroupDuty(this.name,this.users,duty)
        return this
    }
    get users(){
        return bot.users.getGroupUsers(this.name)
    }
    get duty(){
        return this._duty
    }
    // getUser(userId:number):User|undefined{
    //     return this._users.find(x=>x.info.id === userId)
    // }

    async sendPhoto(image:Buffer,name:string,settings:UserSettingsType,groups:boolean,html?:string){
        for(let user of bot.users.getGroupUsers(this.name)){
            let gradient = user.settings.theme
            let img = html&&gradient!=='standard'? await new HtmlToImage(gradient,html).getImage():image
            let groupTg = groups ? await payments.groupIsPaid(user):true
            if(user.payment.status !== 0 && user.settings[settings] === 'on' && groupTg){
                if(bot.devMode&&user.info.id !== 6018898378)return;
                user.sendPhoto(img,name)
            }
        }
    }

    async setReplacement(fields:string[],date:string){
        fields.unshift(`
<tr><td colspan="8"><b>ЗАМЕНЫ ${date}</b></td></tr>
<tr><td><b>Группа</b></td><td><b>Пара</b></td><td colspan="2"><b>По расписанию</b></td><td><b><===></b></td><td colspan="2"><b>Замена</b></td><td><b>Аудитория</b></td></tr>
<tr><td colspan="8" class="line"></td></tr>`)
        this.replacement.setReplacement(fields.join(''),(await new Settings().load('replacementLink')).value)
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