import {SQL} from "../../sql";


export default async function (userId:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    let group = await SQL.groups.select_schedule(user.groupName)
    let table = group.schedule!==null?group.schedule:`<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`
    return {table: table}
}

export async function select(userId:number):Promise<{table:string}>{
    let user = await SQL.users.select(userId)
    let groups = await SQL.groups.select_all()
    let table = []
    let table2 = []
    for(let group of groups){
        if(group.name === user.groupName){
            table.push(`<option selected value='${group.name}'>${group.name}</option>`)
        }else if(group.schedule === 'null'){
            table2.push(`<option disabled value='${group.name}'>${group.name}</option>`)
        }
        else{
            table.push(`<option value='${group.name}'>${group.name}</option>`)
        }
    }
    return {table: table.concat(table2).join('')}
}

export async function update(groupName:string):Promise<{table:string}>{
    let group = await SQL.groups.select_schedule(groupName)
    let table = group.schedule!==null?group.schedule:`<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`
    return {table: table}
}