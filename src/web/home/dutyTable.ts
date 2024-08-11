import {SQL} from "../../sql";
import {Functions} from "../../functions";


export default async function (userId:number,num:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    let table = await Functions.duty.generateHTML(user.groupName,num)
    return {table: table}
}