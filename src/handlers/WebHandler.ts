import express from "express";
import cors from "cors";
import path from "node:path";
import http from "node:http";
import web from "../web";

export default (dirname:string)=>{
    const app = express()
    app.use(cors());
    app.get('/', (_, res) => {res.sendFile(path.join(dirname+'/site/index.html'))})

    //HOME
    app.get('/home', async (req, res) => {
        res.send(web.pages.home(dirname, Number(req.query.user)))
    })
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

    //DUTY
    app.get('/duty', async (req, res) => {
        res.send(web.pages.duty(dirname, Number(req.query.user)))
    })
    app.get('/duty/table', async (req, res) => {
        res.send(web.duty.table(Number(req.query.user), Number(req.query.page)));
    })

    //PROFILE
    app.get('/profile', async (_, res) => {
        res.send(web.pages.profile(dirname))
    })
    app.get('/profile/info/table', async (req, res) => {
        res.send(web.profile.info.table(Number(req.query.user)));
    })
    app.get('/profile/settings/group', async (req, res) => {
        const table = web.profile.settings.group(Number(req.query.user), String(req.query.group))
        table ? res.send(table) : res.send()
    })
    app.get('/profile/settings/dutyDay', async (req, res) => {
        const table = web.profile.settings.dutyDay(Number(req.query.user), Number(req.query.day))
        table ? res.send(table) : res.send()
    })
    app.get('/profile/settings/name', async (req, res) => {
        const table = web.profile.settings.name(Number(req.query.user), String(req.query.name))
        table ? res.send(table) : res.send()
    })
    app.get('/profile/info/refKey', async (req, res) => {
        const alert = await web.profile.info.refKey(Number(req.query.user), String(req.query.refKey))
        res.send({alert})
    })
    app.get('/profile/info/monthPay', async (req, res) => {
        const table = web.profile.info.monthPay(Number(req.query.user), Number(req.query.months))
        res.send({alert: table})
    })

    //SETTINGS
    app.get('/settings', async (_, res) => {
        res.send(web.pages.settings(dirname))
    })
    app.get('/settings/notifications/table', async (req, res) => {
        res.send(web.settings.notifications.table(Number(req.query.user)));
    })
    app.get('/settings/notifications/schedule', async (req, res) => {
        res.send(web.settings.notifications.schedule(Number(req.query.user)));
    })
    app.get('/settings/notifications/replacement', async (req, res) => {
        res.send(web.settings.notifications.replacement(Number(req.query.user)));
    })
    app.get('/settings/notifications/duty', async (req, res) => {
        res.send(web.settings.notifications.duty(Number(req.query.user)));
    })
    app.get('/settings/theme/table', async (req, res) => {
        res.send(web.settings.theme.table(Number(req.query.user)));
    })
    app.post('/settings/theme/background', async (req, res) => {
        res.send(web.settings.theme.background(Number(req.query.user), String(req.query.url)));
    })
    app.post('/settings/theme/lightMode', async (req, res) => {
        res.send(web.settings.theme.lightMode(Number(req.query.user)));
    })


    app.get("/gradient", async (req,res) => {
        res.send(web.gradient(Number(req.query.user)));
    });

    app.get("/styles/main.css", async (req,res) => {
        res.sendFile(path.join(dirname+'/site/styles/main.css'));
    });

    app.get("/scripts/index.js", async (req,res) => {
        res.sendFile(path.join(dirname+'/site/scripts/index.js'));
    });
    app.get("/scripts/home.js", async (req,res) => {
        res.sendFile(path.join(dirname+'/site/scripts/home.js'));
    });
    app.get("/scripts/profile.js", async (req,res) => {
        res.sendFile(path.join(dirname+'/site/scripts/profile.js'));
    });
    app.get("/scripts/settings.js", async (req,res) => {
        res.sendFile(path.join(dirname+'/site/scripts/settings.js'));
    });
    app.get("/scripts/duty.js", async (req,res) => {
        res.sendFile(path.join(dirname+'/site/scripts/duty.js'));
    });

    const httpServer = http.createServer(app);
    httpServer.listen(3000,'localhost');
}