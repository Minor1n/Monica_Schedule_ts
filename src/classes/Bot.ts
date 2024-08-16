import {Telegraf} from "telegraf";
import {config} from "../config";
import mysql from "mysql";
import {Gradients} from "./Gradient";


const data = {
    host: config.SQLHOST,
    user: config.SQLUSER,
    database: config.SQLDATABASE,
    password: config.SQLPASSWORD,
}

export class Bot{
    bot:Telegraf
    connection:mysql.Pool
    gradients!: Gradients
    constructor() {
        this.bot = new Telegraf(config.TOKEN)
        this.connection = mysql.createPool(data);
        this.bot.launch()
        this.bot.telegram.sendMessage(6018898378,'Бот запущен!')
            .then(msg=>setTimeout(()=>{
                this.bot.telegram.deleteMessage(msg.chat.id,msg.message_id).catch(e=>console.log(e))
            },30*1000)).catch(e=>{console.log(e)})
    }
    async addGradients() {
        this.gradients = await new Gradients().load()
        return this.gradients
    }
}