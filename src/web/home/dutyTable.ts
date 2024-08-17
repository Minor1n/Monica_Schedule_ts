import {Functions} from "../../functions";
import {User} from "../../classes";


export const dutyTable = async(userId:number,num:number):Promise<{table:string}>=>{
    let user = await new User().load(userId)
    let table = await Functions.duty.generateHTML(user.info.groupName,num)
    return {table: table}
}