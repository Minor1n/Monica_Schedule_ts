import {Replacements} from "../../classes";


export const replacementTable = async(index:number):Promise<{table:string}>=>{
    let replacement = (await new Replacements().load()).getReplacement(index)
    let table = replacement?.html ? replacement.html : `null`
    return {table: table}
}