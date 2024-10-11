import {bot} from "@index";
import {MysqlError} from "mysql";
import MafiaSession from "@classes/games/MafiaSession";
import ISessionQuery from "@interfaces/ISessionQuery";

export default class MafiaSessions {
    games:MafiaSession[] = []
    private map: Map<number, MafiaSession> = new Map();

    constructor() {}

    async load(){
        const querySessions = await querySQL.sessions()
        for(let i = 0; i < querySessions.length; i++){
            const session = await new MafiaSession(querySessions[i].authorid,'null').load()
            this.map.set(querySessions[i].authorid,session)
            this.games.push(session)
        }
        return this
    }

    getSession(sessionId: number) {
        return this.map.get(sessionId);
    }

    async createSession(sessionId: number,socketId:string) {
        await querySQL.createSession(sessionId)
        const newSession = await new MafiaSession(sessionId,socketId).load()
        this.map.set(sessionId, newSession)
        this.games.push(newSession)
        return newSession
    }

    removeSession(sessionId: number) {
        querySQL.removeSession(sessionId)
        this.map.delete(sessionId)
        const gamesArr:MafiaSession[] = []
        this.games.forEach(element=>{
            if(element.sessionId !== sessionId){
                gamesArr.push(element)
            }
        })
        this.games = gamesArr
        return this
    }
}

const querySQL = {
    sessions: async (): Promise<ISessionQuery[]> => {
        return queryDatabase(`SELECT * FROM sessions`,[]);
    },
    createSession: async(sessionId: number)=>{
        await queryDatabase(`INSERT INTO sessions (authorid) VALUES (?)`, [sessionId]);
    },
    removeSession: async(sessionId: number)=>{
        await queryDatabase(`DELETE FROM sessions WHERE authorid = ?`, [sessionId]);
    }
};

async function queryDatabase(query: string, values: any[]): Promise<ISessionQuery[]> {
    return new Promise((resolve, reject) => {
        bot.gamesConnection.query(query, values, (err: MysqlError | null, result: ISessionQuery[]) => {
            if (err) {
                return reject(new Error(`SQL ERROR ${err}`));
            }
            if (result) {
                resolve(result);
            } else {
                reject(new Error('GAME not found'));
            }
        });
    });
}