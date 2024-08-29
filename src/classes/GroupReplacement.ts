import {bot} from "../index";


export class GroupReplacement{
    html:string
    link:string
    private readonly groupName:string

    constructor(groupName:string,html:string,link:string){
        this.groupName = groupName
        this.html = html
        this.link = link
    }

    setReplacement(html:string,link:string){
        this.html = html
        this.link = link
        bot.connection.query(`UPDATE groups SET replacement = '${html}' WHERE name = '${this.groupName}'`)
    }
}