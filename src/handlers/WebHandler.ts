import express from "express";
import cors from "cors";
import http from "node:http";
import web from "../web";

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
    app.get('/home/schedule/groupTable', async (req, res) => {
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

    app.get("/gradient", async (req,res) => {
        res.send(web.gradient(Number(req.query.user)));
    });

    const httpServer = http.createServer(app);
    httpServer.listen(5000,'localhost');
}