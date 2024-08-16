import {connection} from "../index";
import {MysqlError} from "mysql";

interface ReplacementI{
    link:string|undefined
    date:number|undefined
    html:string|undefined
}

class Replacement implements ReplacementI{
    date: number|undefined;
    html: string|undefined;
    link: string|undefined;
    constructor(res:ReplacementI) {
        this.html = res.html
        this.date = res.date
        this.link = res.link
    }
}
export class Replacements {
    replacements!:ReplacementI[]
    constructor() {}
    async load():Promise<Replacements>{
        let replacements = await querySQL.replacements()
        this.replacements = replacements.map(x=> new Replacement(x)).reverse()
        return this
    }
    insertReplacement(link:string,date:number,html:string){
        this.replacements.push(new Replacement({link:link,date:date,html:html}))
        connection.query(`INSERT INTO replacements (link,date,html) VALUES('${link}','${date}','${html}')`)
    }
    getReplacement(index:number){
        return this.replacements[index]
    }
}

const querySQL = {
    replacements: async ():Promise<ReplacementI[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM replacements`, (err: MysqlError | null, result:ReplacementI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Replacements')
                }else{
                    resolve(result)
                }
            })
        })
    }
}