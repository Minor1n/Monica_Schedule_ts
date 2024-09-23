import {MafiaPlayer} from "./MafiaPlayer";
import {bot} from "../../index";
import {MysqlError} from "mysql";

interface IPlayersQuery {
    session:number;
    id:number;
    role:string;
    isDeath:'true'|'false';
}

export class MafiaSession {
    sessionId!: number;
    socketId!: string;
    players: MafiaPlayer[] = [];
    private map: Map<number,MafiaPlayer> = new Map()

    constructor(id:number,socketId:string) {
        this.sessionId = id;
        this.socketId = socketId;
    }

    async load(){
        const queryPlayers = await querySQL.getPlayers(this.sessionId)
        for(let i = 0; i < queryPlayers.length; i++){
            const query = queryPlayers[i]
            const player = new MafiaPlayer(query.id,query.role,query.isDeath,'null')
            this.map.set(query.id,player)
            this.players.push(player)
        }
        return this
    }

    getPlayer(userId:number){
        return this.map.get(userId)
    }

    addPlayer(userId:number,socketId:string){
        querySQL.addPlayer(this.sessionId,userId)
        const newPlayer = new MafiaPlayer(userId,'null','false',socketId)
        this.map.set(userId,newPlayer)
        this.players.push(newPlayer)
        return newPlayer
    }

    removePlayer(userId:number){
        querySQL.removePlayer(userId)
        this.map.delete(userId)
        this.players.filter(element=>element.id !== userId)
    }
}

const querySQL = {
    getPlayers: async (sessionId:number): Promise<IPlayersQuery[]> => {
        return queryDatabase(`SELECT * FROM players WHERE session = ?`,[sessionId]);
    },
    addPlayer: async(sessionId: number,userId:number)=>{
        await queryDatabase(`INSERT INTO players (session,id) VALUES (?,?)`, [sessionId,userId]);
    },
    removePlayer: async(userId: number)=>{
        await queryDatabase(`DELETE FROM players WHERE id = ?`, [userId]);
    }
};

async function queryDatabase(query: string, values: any[]): Promise<IPlayersQuery[]> {
    return new Promise((resolve, reject) => {
        bot.gamesConnection.query(query, values, (err: MysqlError | null, result: IPlayersQuery[]) => {
            if (err) {
                return reject(new Error(`SQL ERROR ${err}`));
            }
            resolve(result);
        });
    });
}