import type IMafiaPlayer from "@interfaces/IMafiaPlayer";
import {Server} from "socket.io";


export default (io:Server, sessionId: number, players: IMafiaPlayer[]) => {
    io.emit('updatePlayers', { newPlayers: players, sessionId });
    players.forEach(player => {
        io.emit('updatePlayer', player);
    });
};