import {Server, Socket} from "socket.io";
import type IMafiaJoin from "@interfaces/IMafiaJoin";
import {bot} from "@index";
import {mafia} from "@utils";


export default (io: Server, socket: Socket, newState: IMafiaJoin) => {
    try {
        const session = bot.mafiaSessions.getSession(newState.sessionId);
        if (!session) return;
        const player = session.getPlayer(newState.userId) ?? session.addPlayer(newState.userId, socket.id);
        const newPlayers = mafia.mapPlayers(session.players);

        mafia.updatePlayersInfo(io, newState.sessionId, newPlayers);
        io.emit('updatePlayer', {
            userId: newState.userId,
            userName: bot.users.getUser(newState.userId)?.info.name,
            role: player.role,
            isDeath: player.isDeath,
        });
    } catch (error) {
        console.error('Error joining player:', error);
    }
}