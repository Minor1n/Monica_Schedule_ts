import express, {Router} from "express";
import cors from "cors";
import http from "node:http";
import {Server} from 'socket.io';
import {bot} from "@index";
import components from "@web/components";


import IWebComponent from "@interfaces/IWebComponent";

export default ()=>{
    const app = express()
    app.use(cors());

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: bot.devMode ? "http://localhost:3000" : "https://minorin.ru",
            methods: ["GET", "POST"]
        }
    });

    const homeRouter = express.Router();
    const dutyRouter = express.Router();
    const profileRouter = express.Router();
    const settingsRouter = express.Router();
    const mafiaRouter = express.Router();

    const registerRoutes = (appInstance: Router, routes: IWebComponent[]) => {
        routes.forEach(({ method, url, handler }) => {
            appInstance[method](url, async (req, res) => {
                const query = req.query
                if(method === 'get'){
                    res.send(await handler(query));
                }else{
                    await handler(query);
                    res.statusCode = 200
                    res.send()
                }
            });
        });
    };

    registerRoutes(app, components.standardRouterHandlers);
    registerRoutes(homeRouter, components.homeRouterHandlers);
    registerRoutes(dutyRouter, components.dutyRouterHandlers);
    registerRoutes(profileRouter, components.profileRouterHandlers);
    registerRoutes(settingsRouter, components.settingsRouterHandlers);
    registerRoutes(mafiaRouter, components.mafiaRouterHandlers);

    app.use('/home', homeRouter);
    app.use('/duty', dutyRouter);
    app.use('/profile', profileRouter);
    app.use('/settings', settingsRouter);
    app.use('/games/mafia', mafiaRouter);

    io.on('connection', (socket) => {
        components.sockets.forEach(({ url, handler }) => {
            socket.on(url, async (newState) => {
                await handler(io, socket, newState);
            });
        });
    })

    httpServer.listen(5000,bot.devMode?'localhost':'104.164.54.119');
}