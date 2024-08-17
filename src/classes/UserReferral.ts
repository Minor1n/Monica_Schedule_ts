import {connection} from "../index";
import {MysqlError} from "mysql";
import {User} from "./User";

type ReferralsT={
    agentId:number
    userId:number
    refKey:string
}

interface UserReferralI{
    id:number;
    key:string;
    agents:ReferralsT[];
    agentsApprove:number;
    user:ReferralsT;
}

export class UserReferral implements UserReferralI{
    id:number;
    private _agents!: ReferralsT[];
    private _agentsApprove!:number
    private _user!:ReferralsT;
    private readonly _key: string;
    constructor(id:number,key:string) {
        this.id = id
        this._key = key
    }
    async load():Promise<UserReferral>{
        let agents = await querySQL.agents(this.id)
        let user = await querySQL.user(this.id)
        this._agents = agents
        let approve = 0
        for(let agent of agents){
            let user = await new User().load(agent.userId)
            if(user.payment.status > 1 && user.payment.paid === 'true'){
                approve+=1
            }
        }
        this._agentsApprove = approve
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

    insertReferral(userId:number){
        this._agents.push({agentId:this.id,userId:userId,refKey:this._key})
        connection.query(`INSERT INTO referrals (agentId,userId,refKey) VALUES('${this.id}','${userId}','${this._key}')`)
    }
    //
    // set agentsApprove(value){
    //     this._agentsApprove = value
    //     connection.query(`UPDATE users SET refAgents = '${value}' WHERE userId = '${this.id}'`)
    // }
}

const querySQL={
    agents:async (agentId:number):Promise<ReferralsT[]>=>{
        return new Promise(async function (resolve){
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
        return new Promise(async function (resolve){
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