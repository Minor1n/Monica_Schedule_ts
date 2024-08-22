import {UserRole} from "./IUserQuery";

export interface IUserInfo{
    id:number;
    userName:string;
    name:string;
    groupName:string
    role:UserRole
    bots:number
}