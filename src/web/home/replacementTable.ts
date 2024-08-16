import {Replacements} from "../../classes/Replacement";


export default async function (index:number):Promise<{table:string}>{
    let replacement = (await new Replacements().load()).getReplacement(index)
    let table = replacement?.html ? replacement.html : `<tr><td><b>Замены не найдены!</b></td></tr>`
    return {table: table}
}