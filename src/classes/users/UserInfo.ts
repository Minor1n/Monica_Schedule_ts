import {bot} from "@index";
import IUserInfo from "@interfaces/IUserInfo";
import {UserRoleType} from "@types";

export default class UserInfo implements IUserInfo{
    private readonly _bots: number;
    private _groupName: string;
    private readonly _id: number;
    private _name: string;
    private readonly _role: UserRoleType;
    private _userName: string;
    constructor(bots:number,groupName:string,id:number,name:string,userName:string,role:UserRoleType) {
        this._bots = bots
        this._groupName = groupName
        this._id = id
        this._name = name
        this._role = role
        this._userName = userName
    }
    get bots(): number {
        return this._bots;
    }

    get groupName(): string {
        return this._groupName;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get role(): UserRoleType {
        return this._role;
    }

    get userName(): string {
        return this._userName;
    }

    set groupName(value: string) {
        this._groupName = value;
        this.updateField('groupName', value);
    }

    set name(value: string) {
        this._name = value;
        this.updateField('name', value);
    }

    set userName(value: string) {
        this._userName = value;
        this.updateField('userName', value);
    }

    private updateField(field: string, value: string) {
        const query = `UPDATE users SET ${field} = ? WHERE userId = ?`;
        bot.connection.query(query, [value, this._id], (err) => {
            if (err) {
                console.error(`SQL ERROR: ${err.message}`);
            }
        });
    }
}