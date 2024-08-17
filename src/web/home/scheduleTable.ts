import {User,Group, Groups} from "../../classes";


export const scheduleTable = async(userId:number):Promise<{table:string}>=>{
    let user = await new User().load(userId)
    let group = await new Group().load(user.info.groupName)
    let table = group.schedule!=='null'?group.schedule:`<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`
    return {table: table}
}

export async function select(userId:number):Promise<{table:string}>{
    let user = await new User().load(userId)
    let groups = await new Groups().load()
    let table = []
    let table2 = []
    for(let group of groups.all){
        if(group.name === user.info.groupName){
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
    let group = await new Group().load(groupName)
    let table = group.schedule!=='null'?group.schedule:`<tr><td><b>Расписание еще не было сгенерировано!</b></td></tr>`
    return {table: table}
}