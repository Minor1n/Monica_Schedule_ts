import express from "express";
import cors from "cors";
import http from "node:http";
import web from "../web";
import {bot} from "../index";
import {Server} from 'socket.io';
import {MafiaPlayer} from "../classes/games/MafiaPlayer";

export default ()=>{
    const app = express()
    app.use(cors());

    //HOME
    app.get('/home/schedule/table', async (req, res) => {
        res.send(web.home.schedule.table(Number(req.query.user)));
    })
    app.get('/home/schedule/select', async (req, res) => {
        res.send(web.home.schedule.select(Number(req.query.user)));
    })
    app.get('/home/schedule/update', async (req, res) => {
        res.send(web.home.schedule.update(String(req.query.group)));
    })
    app.get('/home/replacement/table', async (req, res) => {
        res.send(await web.home.replacement.table(Number(req.query.page)));
    })
    app.get('/home/replacement/groupTable', async (req, res) => {
        res.send(web.home.replacement.groupTable(Number(req.query.user)));
    })

    //DUTY
    app.get('/duty/table', async (req, res) => {
        res.send(web.duty.table(Number(req.query.user), Number(req.query.page)));
    })
    app.get('/duty/checkin', async (req, res) => {
        res.send(web.duty.checkin(Number(req.query.user)))
    })

    //PROFILE
    app.get('/profile/info/table', async (req, res) => {
        res.send(web.profile.info.table(Number(req.query.user)));
    })
    app.get('/profile/settings/group', async (req, res) => {
        web.profile.settings.group(Number(req.query.user), String(req.query.group))
        res.send()
    })
    app.get('/profile/settings/dutyDay', async (req, res) => {
        web.profile.settings.dutyDay(Number(req.query.user), Number(req.query.day))
        res.send()
    })
    app.get('/profile/settings/name', async (req, res) => {
        web.profile.settings.name(Number(req.query.user), String(req.query.name))
        res.send()
    })
    app.get('/profile/info/refKey', async (req, res) => {
        const alert = await web.profile.info.refKey(Number(req.query.user), String(req.query.refKey))
        res.send({alert})
    })
    app.get('/profile/info/monthPay', async (req, res) => {
        const alert = web.profile.info.monthPay(Number(req.query.user), Number(req.query.months))
        res.send({alert})
    })

    //SETTINGS
    app.get('/settings/notifications/table', async (req, res) => {
        res.send(web.settings.notifications.table(Number(req.query.user)));
    })
    app.get('/settings/notifications/schedule', async (req, res) => {
        web.settings.notifications.schedule(Number(req.query.user))
        res.send();
    })
    app.get('/settings/notifications/replacement', async (req, res) => {
        web.settings.notifications.replacement(Number(req.query.user))
        res.send();
    })
    app.get('/settings/notifications/duty', async (req, res) => {
        web.settings.notifications.duty(Number(req.query.user))
        res.send();
    })
    app.get('/settings/theme/table', async (req, res) => {
        res.send(web.settings.theme.table(Number(req.query.user)));
    })
    app.post('/settings/theme/background', async (req, res) => {
        web.settings.theme.background(Number(req.query.user), String(req.query.url))
        res.send();
    })
    app.post('/settings/theme/lightMode', async (req, res) => {
        web.settings.theme.lightMode(Number(req.query.user))
        res.send();
    })

    //Games

    //Mafia
    app.get('/games/mafia/sessions',async (req,res)=>{
        const sessions = bot.mafiaSessions.games.map(session=>{
            return {
                authorId: session.sessionId,
                authorName: bot.users.getUser(session.sessionId)?.info.name,
                users: session.players.length
            }
        })
        res.send(sessions)
    })

    app.get('/games/mafia/exit',async (req,res)=>{
        const session = bot.mafiaSessions.getSession(Number(req.query.user))
        if(session){
            session.players.forEach((player)=>{
                session.removePlayer(player.id)
            })
            bot.mafiaSessions.removeSession(session.sessionId)
        }
        const newSessions = bot.mafiaSessions.games.map(session=>{
            return {
                authorId: session.sessionId,
                authorName: bot.users.getUser(session.sessionId)?.info.name,
                users: session.players.length
            }
        })
        res.send(newSessions)
    })

    app.get('/games/mafia/players',async (req,res)=>{
        const players = bot.mafiaSessions.getSession(Number(req.query.user))?.players.map(player=>({
            userId: player.id,
            userName: bot.users.getUser(player.id)?.info.name,
            role: player.role,
            isDeath: player.isDeath
        }))
        res.send(players)
    })

    //Other

    app.get("/gradient", async (req,res) => {
        res.send(web.gradient(Number(req.query.user)));
    });

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: bot.devMode ? "http://localhost:3000" : "https://minorin.ru",
            methods: ["GET", "POST"]
        }
    });

    interface IHost {
        userId: number;
        socketId: string;
    }

    interface IJoin {
        userId: number;
        socketId: string;
        sessionId: number;
    }

    interface IPlayer {
        userId: number;
        userName: string;
        role: string;
        isDeath: 'true' | 'false';
    }

    const mapPlayers = (players: MafiaPlayer[]) => players.map(player => ({
        userId: player.id,
        userName: String(bot.users.getUser(player.id)?.info.name),
        role: player.role,
        isDeath: player.isDeath
    }));

    const updatePlayersInfo = (sessionId: number, players: IPlayer[]) => {
        io.emit('updatePlayers', { newPlayers: players, sessionId });
        players.forEach(player => {
            io.emit('updatePlayer', player);
        });
    };

    io.on('connection', (socket) => {

        socket.on('setHost', async (newState: IHost) => {
            try {
                const session = bot.mafiaSessions.getSession(newState.userId) ?? await bot.mafiaSessions.createSession(newState.userId, newState.socketId);
                const newPlayers = mapPlayers(session.players);
                updatePlayersInfo(newState.userId, newPlayers);
            } catch (error) {
                console.error('Error setting host:', error);
            }
        });

        socket.on('joinPlayer', (newState: IJoin) => {
            try {
                const session = bot.mafiaSessions.getSession(newState.sessionId);
                if (!session) return;
                const player = session.getPlayer(newState.userId) ?? session.addPlayer(newState.userId, socket.id);
                const newPlayers = mapPlayers(session.players);

                updatePlayersInfo(newState.sessionId, newPlayers);
                io.emit('updatePlayer', {
                    userId: newState.userId,
                    userName: bot.users.getUser(newState.userId)?.info.name,
                    role: player.role,
                    isDeath: player.isDeath,
                });
            } catch (error) {
                console.error('Error joining player:', error);
            }
        });

        socket.on('setPlayers', (options: { newPlayers: IPlayer[], sessionId: number }) => {
            updatePlayersInfo(options.sessionId, options.newPlayers);
        });

        socket.on('disconnect', () => {
            try {
                const session = bot.mafiaSessions.games.find(game => game.socketId === socket.id);
                if (session) {
                    session.players.forEach(player => session.removePlayer(player.id));
                    bot.mafiaSessions.removeSession(session.sessionId);
                    return;
                }

                const sessionPlayer = bot.mafiaSessions.games.find(game =>
                    game.players.some(player => player.socketId === socket.id)
                );

                if (sessionPlayer) {
                    const player = sessionPlayer.players.find(player => player.socketId === socket.id);
                    if (player) {
                        sessionPlayer.removePlayer(player.id);
                    }
                }
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });

    httpServer.listen(5000,bot.devMode?'localhost':'104.249.40.163');
}
