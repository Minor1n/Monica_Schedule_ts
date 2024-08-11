import {SQL} from "../../sql";


export default async function (index:number):Promise<{table:string}>{
    let replacement = await SQL.replacement.select_by_index(index)
    let table = replacement ? replacement.html : 'null'
    return {table: table}
}