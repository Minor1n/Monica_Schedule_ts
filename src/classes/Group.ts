import {connection} from "../index";
import {MysqlError} from "mysql";
import {User, UserT} from "./User";

interface DutyI{
    group:string
    date:number
    user:number
    name:string
}

interface GroupI{
    name: string
    schedule: string
    replacement: string
    next: string
    users:User[]
    duties:DutyI[]
}

export class Group implements GroupI{
    name!: string;
    next!: string;
    private _replacement!: string;
    private _schedule!: string;
    private _users!:User[]
    private _duties!:DutyI[]
    constructor() {}
    async load(groupName:string,next?:string,replacement?:string,schedule?:string):Promise<Group>{
        if(next&&replacement&&schedule){
            this.name = groupName
            this.next = next
            this._replacement = replacement
            this._schedule = schedule
        }else{
            let q = await querySQL.groups(groupName)
            this.name = q.name
            this.next = q.next
            this._replacement = q.replacement
            this._schedule = q.schedule
        }
        let users = await querySQL.users(groupName)
        let duty = await querySQL.duty(groupName)
        this._users = await Promise.all(users.map(async (x)=>new User().load(x.userId,x)))
        this._duties = duty
        return this
    }
    get replacement(){
        return this._replacement
    }
    get schedule(){
        return this._schedule
    }
    get users(){
        return this._users
    }
    get duties(){
        return this._duties
    }
    getUser(userId:number):User|undefined{
        return this._users.find(x=>x.info.id === userId)
    }
    getDuty(start:number,end:number):DutyI[]{
        return this._duties.filter(x=>x.date>start&&x.date<end)
    }

    set schedule(value){
        this._schedule = value
        connection.query(`UPDATE groups SET schedule = '${value}' WHERE name = '${this.name}'`)
    }

    insertDuty(date:number,userId:number,name:string){
        this._duties.push({group:this.name,date:date,user:userId,name:name})
        connection.query(`INSERT INTO duty (\`group\`,\`date\`,\`user\`,\`name\`) values('${this.name}','${date}','${userId}','${name}')`)
    }
}

export class Groups{
    all!:Group[]
    constructor() {}
    getGroup(groupName:string){
        return this.all.find(x=>x.name === groupName)
    }
    async load():Promise<Groups>{
        let q = await querySQL.all()
        this.all = await Promise.all(q.map(async (x)=>new Group().load(x.name,x.next,x.replacement,x.schedule)))
        return this
    }
}

const querySQL={
    groups:async (groupName:string):Promise<GroupI>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM groups WHERE name = '${groupName}'`, async (err:MysqlError|null, result:GroupI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Group')
                }else{
                    resolve(result[0])
                }
            })
        })
    },
    users:async (groupName:string):Promise<UserT[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM users WHERE groupName = '${groupName}'`, async (err:MysqlError|null, result:UserT[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Group Users')
                }else{
                    resolve(result)
                }
            })
        })
    },
    duty:async (groupName:string):Promise<DutyI[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM duty WHERE \`group\` = '${groupName}'`, async (err:MysqlError|null, result:DutyI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Group Duty')
                }else{
                    resolve(result)
                }
            })
        })
    },
    all:async ():Promise<GroupI[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query('SELECT * FROM groups', async (err:MysqlError|null, result:GroupI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Groups')
                }else{
                    resolve(result)
                }
            })
        })
    },
}