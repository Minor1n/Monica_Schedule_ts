import {bot} from "../../index";
import {MysqlError} from "mysql";


export class MafiaPlayer {
    id: number;
    private _socketId!: string;
    private _role: string;
    private _isDeath: 'true' | 'false';

    constructor(id: number, role: string, isDeath: 'true' | 'false', socketId: string) {
        this.id = id;
        this._role = role;
        this._isDeath = isDeath;
        this._socketId = socketId;
    }

    set role(roleName: string) {
        this._role = roleName;
    }

    set isDeath(status: 'true' | 'false') {
        this._isDeath = status;
    }

    set socketId(socketId: string) {
        this._socketId = socketId;
    }

    get role() {
        return this._role;
    }

    get isDeath() {
        return this._isDeath;
    }

    get socketId() {
        return this._socketId;
    }
}

const querySQL = {
    updateRole: async(userId:number,role:string)=>{
        await queryDatabase(`UPDATE players SET role = ? WHERE id = ?`, [role,userId]);
    },
    updateIsDeath: async(userId: number,isDeath:'true'|'false')=>{
        await queryDatabase(`UPDATE players SET isDeath = ? WHERE id = ?`, [isDeath,userId]);
    }
};

async function queryDatabase(query: string, values: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
        bot.gamesConnection.query(query, values, (err: MysqlError | null) => {
            if (err) {
                return reject(new Error(`SQL ERROR ${err}`));
            }
        });
    });
}