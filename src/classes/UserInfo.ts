import {connection} from "../index";

interface UserInfoI{
    id:number;
    userName:string;
    name:string;
    groupName:string
    role:'headman'|'user'|'support'|'admin'|'group'
    bots:number
}

export class UserInfo implements UserInfoI{
    private readonly _bots: number;
    private _groupName: string;
    private readonly _id: number;
    private _name: string;
    private readonly _role: "headman" | "user" | "support" | "admin" | "group";
    private _userName: string;
    constructor(bots:number,groupName:string,id:number,name:string,userName:string,role:"headman" | "user" | "support" | "admin" | "group") {
        this._bots = bots
        this._groupName = groupName
        this._id = id
        this._name = name
        this._role = role
        this._userName = userName
    }
    get bots(){
        return this._bots
    }
    get groupName(){
        return this._groupName
    }
    get id(){
        return this._id
    }
    get name(){
        return this._name
    }
    get role(){
        return this._role
    }
    get userName(){
        return this._userName
    }
    set groupName(value){
        this._groupName = value
        connection.query(`UPDATE users SET groupName = '${value}' WHERE userId = '${this.id}'`)
    }
    set name(value){
        this._name = value
        connection.query(`UPDATE users SET name = '${value}' WHERE userId = '${this._id}'`)
    }
    set userName(value){
        this._userName = value
    }
}