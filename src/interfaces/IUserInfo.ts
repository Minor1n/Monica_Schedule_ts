import {UserRoleType} from "@interfaces/Types";

export default interface IUserInfo{
    id:number;
    userName:string;
    name:string;
    groupName:string
    role:UserRoleType
    bots:number
}