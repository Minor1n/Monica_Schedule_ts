import {bot} from "@index";
import type {MysqlError} from "mysql";
import MafiaPlayer from "@classes/games/MafiaPlayer";
import type IMafiaPlayersQuery from "@interfaces/IMafiaPlayersQuery";

export default class MafiaSession {
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
            const player = new MafiaPlayer(query.id,query.role,query.isDeath)
            this.map.set(query.id,player)
            this.players.push(player)
        }
        return this
    }

    getPlayer(userId:number){
        return this.map.get(userId)
    }

    addPlayer(userId:number){
        querySQL.addPlayer(this.sessionId,userId)
        const newPlayer = new MafiaPlayer(userId,'null','false')
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
    getPlayers: async (sessionId:number): Promise<IMafiaPlayersQuery[]> => {
        return queryDatabase(`SELECT * FROM players WHERE session = ?`,[sessionId]);
    },
    addPlayer: async(sessionId: number,userId:number)=>{
        await queryDatabase(`INSERT INTO players (session,id) VALUES (?,?)`, [sessionId,userId]);
    },
    removePlayer: async(userId: number)=>{
        await queryDatabase(`DELETE FROM players WHERE id = ?`, [userId]);
    }
};

async function queryDatabase(query: string, values: any[]): Promise<IMafiaPlayersQuery[]> {
    return new Promise((resolve, reject) => {
        bot.gamesConnection.query(query, values, (err: MysqlError | null, result: IMafiaPlayersQuery[]) => {
            if (err) {
                return reject(new Error(`SQL ERROR ${err}`));
            }
            resolve(result);
        });
    });
}