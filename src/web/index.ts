import express from "express";
import cors from "cors";
import path from "node:path";
import http from "node:http";
import * as home from "./home";
import * as profile from "./profile";
import * as settings from "./settings";
import * as pages from "./pages";
import * as gradient from "./gradient";

export default (dirname:string)=> {
    let app = express()
    app.use(cors());
    app.get('/', (req, res) => {res.sendFile(path.join(dirname+'/html/index.html'))})

    //HOME
    app.get('/home', async (req, res) => {
        res.send(await pages.home(dirname))
    })
    app.get('/home/scheduleTable/[0-9]+', async (req, res) => {
        res.send(await home.scheduleTable.default(Number(req.url.slice(20))));
    })
    app.get('/home/scheduleTable/selectGroup/[0-9]+', async (req, res) => {
        res.send(await home.scheduleTable.select(Number(req.url.slice(32))));
    })
    app.get('/home/scheduleTable/updateGroup/[0-9\%A-Za-z\-]+', async (req, res) => {
        res.send(await home.scheduleTable.update(decodeURI(req.url.slice(32))));
    })
    app.get('/home/replacementTable/[0-9]+', async (req, res) => {
        res.send(await home.replacementTable.default(Number(req.url.slice(23))));
    })
    app.get('/home/dutyTable/[0-9]+/[0-9]+', async (req, res) => {
        let nums = req.url.match(/[0-9]+/g)
        if(!nums)return
        res.send(await home.dutyTable.default(Number(nums[0]),Number(nums[1])));
    })

    //PROFILE
    app.get('/profile', async (req, res) => {
        res.send(await pages.profile(dirname))
    })
    app.get('/profile/[0-9]+', async (req, res) => {
        res.send(await profile.table.default(Number(req.url.slice(9))));
    })
    app.get('/profile/editGroup/[0-9]+/[0-9\%A-Za-z\-]+', async (req, res) => {
        let nums = req.url.slice(19).match(/[0-9%A-Za-z\-]+/g)
        if (nums) { await profile.settings.group(Number(nums[0]), nums[1]).then(()=>res.send()) }
    })
    app.get('/profile/editDutyDay/[0-9]+/[0-9]+', async (req, res) => {
        let nums = req.url.slice(21).match(/[0-9]+/g)
        if (nums) { await profile.settings.dutyDay(Number(nums[0]), Number(nums[1])).then(() => res.send()) }
    })
    app.get('/profile/editName/[0-9]+/[0-9\%A-Za-z\-]+', async (req, res) => {
        let nums = req.url.slice(18).match(/[0-9%A-Za-z\-]+/g)
        if (nums) { await profile.settings.name(Number(nums[0]), nums[1]).then(() => res.send()) }
    })

    //SETTINGS
    app.get('/settings', async (req, res) => {
        res.send(await pages.settings(dirname))
    })
    app.get('/settings/notification/[0-9]+', async (req, res) => {
        res.send(await settings.notification.default(Number(req.url.slice(23))));
    })
    app.get('/settings/notification/schedule/[0-9]+', async (req, res) => {
        res.send(await settings.notification.schedule(Number(req.url.slice(32))));
    })
    app.get('/settings/notification/replacement/[0-9]+', async (req, res) => {
        res.send(await settings.notification.replacement(Number(req.url.slice(35))));
    })
    app.get('/settings/notification/duty/[0-9]+', async (req, res) => {
        res.send(await settings.notification.duty(Number(req.url.slice(28))));
    })
    app.get('/settings/theme/[0-9]+', async (req, res) => {
        res.send(await settings.theme.default(Number(req.url.slice(16))));
    })
    app.post('/settings/theme/bg', async (req, res) => {
        res.send(await settings.theme.bg(Number(req.query.user),String(req.query.url)));
    })
// app.get('/dutyPlus/[0-9]+', async (req, res) => {
//     let user = await SQL.users.select(Number(req.url.slice(10)))
//     res.send({message: await Functions.duty.dutyPlus(user)});
// })
    app.get("/randomGradient/[0-9]+", async (req,res) => {
        res.send(await gradient.default(Number(req.url.slice(16))));
    });

    const httpServer = http.createServer(app);
    httpServer.listen(3000,'localhost');
}