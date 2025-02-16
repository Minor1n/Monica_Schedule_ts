import {Server, Socket} from "socket.io";
import type IMafiaHost from "@interfaces/IMafiaHost";
import {bot} from "@index";
import {mafia} from "@utils";


export default async (io: Server, _socket: Socket, newState: IMafiaHost) => {
    try {
        const session = bot.mafiaSessions.getSession(newState.userId) ?? await bot.mafiaSessions.createSession(newState.userId, newState.socketId);
        const newPlayers = mafia.mapPlayers(session.players);
        mafia.updatePlayersInfo(io,newState.userId, newPlayers);
    } catch (error) {
        console.error('Error setting host:', error);
    }
}