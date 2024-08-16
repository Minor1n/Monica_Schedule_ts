import {connection} from "../index";
import {MysqlError} from "mysql";

type ReferralsT={
    agentId:number
    userId:number
    refKey:string
    status:'true'|'false'
}

interface UserReferralI{
    id:number;
    key:string;
    agents:ReferralsT[];
    agentsApprove:number;
    user:ReferralsT;
    status:'true'|'false';
}

export class UserReferral implements UserReferralI{
    id:number;
    private _agents!: ReferralsT[];
    private _agentsApprove!:number
    private _user!:ReferralsT;
    private readonly _key: string;
    private _status: "true" | "false";
    constructor(id:number,agents:number,key:string,status:"true" | "false") {
        this.id = id
        this._key = key
        this._status = status
    }
    async load():Promise<UserReferral>{
        let agents = await querySQL.agents(this.id)
        let user = await querySQL.user(this.id)
        this._agents = agents
        this._agentsApprove = agents.filter(x=>x.status==='true').length
        this._user = user
        return this
    }
    get agentsApprove():number {
        return this._agentsApprove;
    }
    get agents():ReferralsT[] {
        return this._agents;
    }
    get user():ReferralsT {
        return this._user;
    }
    get key():string {
        return this._key;
    }
    get status():"true" | "false" {
        return this._status;
    }

    insertReferral(userId:number){
        this._agents.push({agentId:this.id,userId:userId,refKey:this._key,status:'true'})
        connection.query(`INSERT INTO referrals (agentId,userId,refKey) VALUES('${this.id}','${userId}','${this._key}')`)
    }

    set status(value: "true" | "false") {
        this._status = value;
        connection.query(`UPDATE users SET refKeyStatus = '${value}' WHERE userId = '${this.id}'`)
    }
    setUserStatus(value:'true'|'false'){
        this._user.status = value
        connection.query(`UPDATE referrals SET status = '${value}' WHERE userId = '${this.id}'`)
    }
    set agentsApprove(value){
        this._agentsApprove = value
        connection.query(`UPDATE users SET refAgents = '${value}' WHERE userId = '${this.id}'`)
    }
}

const querySQL={
    agents:async (agentId:number):Promise<ReferralsT[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM referrals WHERE agentId = '${agentId}'`, (err:MysqlError|null, result:ReferralsT[]) => {
                if (err) {
                    throw new Error('SQL ERROR in UserReferral')
                }else{
                    resolve(result)
                }
            })
        })
    },
    user:async (userId:number):Promise<ReferralsT>=>{
        return new Promise(async function (resolve,reject){
            connection.query(`SELECT * FROM referrals WHERE userId = '${userId}'`, (err:MysqlError|null, result:ReferralsT[]) => {
                if (err) {
                    throw new Error('SQL ERROR in UserReferral')
                }else{
                    resolve(result[0])
                }
            })
        })
    }
}