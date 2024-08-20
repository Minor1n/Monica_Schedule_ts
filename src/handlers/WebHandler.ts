import express from "express";
import cors from "cors";
import path from "node:path";
import http from "node:http";
import {home,profile,settings,gradient,pages} from '../web'

export const WebHandler = (dirname:string)=>{
    let app = express()
    app.use(cors());
    app.get('/', (_, res) => {res.sendFile(path.join(dirname+'/html/index.html'))})

    //HOME
    app.get('/home/[0-9]+', async (req, res) => {
        res.send(pages.home(dirname, Number(req.url.slice(6))))
    })
    app.get('/home/scheduleTable/[0-9]+', async (req, res) => {
        res.send(home.scheduleTable(Number(req.url.slice(20))));
    })
    app.get('/home/scheduleTable/selectGroup/[0-9]+', async (req, res) => {
        res.send(home.select(Number(req.url.slice(32))));
    })
    app.get('/home/scheduleTable/updateGroup/[0-9\%A-Za-z\-]+', async (req, res) => {
        res.send(home.update(decodeURI(req.url.slice(32))));
    })
    app.get('/home/replacementTable/[0-9]+', async (req, res) => {
        res.send(await home.replacementTable(Number(req.url.slice(23))));
    })
    app.get('/home/dutyTable/[0-9]+/[0-9]+', async (req, res) => {
        let nums = req.url.match(/[0-9]+/g)
        if(!nums)return
        res.send(home.dutyTable(Number(nums[0]), Number(nums[1])));
    })

    //PROFILE
    app.get('/profile', async (_, res) => {
        res.send(pages.profile(dirname))
    })
    app.get('/profile/[0-9]+', async (req, res) => {
        res.send(profile.table(Number(req.url.slice(9))));
    })
    app.get('/profile/editGroup/[0-9]+/[0-9\%A-Za-z\-]+', async (req, res) => {
        let nums = req.url.slice(19).match(/[0-9%A-Za-z\-]+/g)
        if (nums) {
            const table = profile.group(Number(nums[0]), nums[1])
            table ? res.send(table) : res.send()
        }
    })
    app.get('/profile/editDutyDay/[0-9]+/[0-9]+', async (req, res) => {
        let nums = req.url.slice(21).match(/[0-9]+/g)
        if (nums) {
            const table = profile.dutyDay(Number(nums[0]), Number(nums[1]))
            table ? res.send(table) : res.send()
        }
    })
    app.get('/profile/editName/[0-9]+/[0-9\%A-Za-z\-]+', async (req, res) => {
        let nums = req.url.slice(18).match(/[0-9%A-Za-z\-]+/g)
        if (nums) {
            const table = profile.name(Number(nums[0]), nums[1])
            table ? res.send(table) : res.send()
        }
    })
    app.get('/profile/setRefKey/[0-9]+/[A-Z]+', async (req, res) => {
        let nums = req.url.slice(18).match(/[0-9A-Z]+/g)
        if (nums) { await profile.refKey(Number(nums[0]), nums[1]).then(result=> res.send({alert: result})) }
    })
    app.get('/profile/monthPay/[0-9]+/[0-9]+', async (req, res) => {
        let nums = req.url.slice(18).match(/[0-9A-Z]+/g)
        if (nums) {
            const table = profile.monthPay(Number(nums[0]), Number(nums[1]))
            res.send({alert: table})
        }
    })

    //SETTINGS
    app.get('/settings', async (_, res) => {
        res.send(pages.settings(dirname))
    })
    app.get('/settings/notification/[0-9]+', async (req, res) => {
        res.send(settings.notification(Number(req.url.slice(23))));
    })
    app.get('/settings/notification/schedule/[0-9]+', async (req, res) => {
        res.send(settings.schedule(Number(req.url.slice(32))));
    })
    app.get('/settings/notification/replacement/[0-9]+', async (req, res) => {
        res.send(settings.replacement(Number(req.url.slice(35))));
    })
    app.get('/settings/notification/duty/[0-9]+', async (req, res) => {
        res.send(settings.duty(Number(req.url.slice(28))));
    })
    app.get('/settings/theme/[0-9]+', async (req, res) => {
        res.send(settings.theme(Number(req.url.slice(16))));
    })
    app.post('/settings/theme/bg', async (req, res) => {
        res.send(settings.bg(Number(req.query.user), String(req.query.url)));
    })
    app.post('/settings/theme/lightMode', async (req, res) => {
        res.send(settings.lightMode(Number(req.query.user)));
    })
// app.get('/dutyPlus/[0-9]+', async (req, res) => {
//     let user = await SQL.users.select(Number(req.url.slice(10)))
//     res.send({message: await Functions.duty.dutyPlus(user)});
// })
    app.get("/randomGradient/[0-9]+", async (req,res) => {
        res.send(gradient(Number(req.url.slice(16))));
    });

    const httpServer = http.createServer(app);
    httpServer.listen(3000,'localhost');
}