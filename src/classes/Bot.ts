import { Telegraf } from "telegraf";
import { config } from "../config";
import mysql from "mysql";
import { Gradients } from "./Gradients";
import { Groups } from "./Groups";
import { Users } from "./Users";

const databaseConfig = {
    host: config.SQLHOST,
    user: config.SQLUSER,
    database: config.SQLDATABASE,
    password: config.SQLPASSWORD,
};

export class Bot {
    bot: Telegraf;
    connection: mysql.Pool;
    gradients!: Gradients;
    groups!: Groups;
    users!: Users;

    constructor() {
        this.bot = new Telegraf(config.TOKEN);
        this.connection = mysql.createPool(databaseConfig);

        //this.launchBot();
    }

    launchBot() {
        this.bot.launch();
        this.sendTemporaryMessage(6018898378, 'Бот запущен!');
    }

    private async loadData<T>(dataLoader: () => Promise<T>, message: string): Promise<T> {
        const data = await dataLoader();
        await this.sendTemporaryMessage(6018898378, message);
        return data;
    }

    async addGradients(): Promise<Gradients> {
        this.gradients = await this.loadData(() => new Gradients().load(), 'Градиенты подключены');
        return this.gradients;
    }

    async addGroups(): Promise<Groups> {
        this.groups = await this.loadData(() => new Groups().load(), 'Группы подключены');
        return this.groups;
    }

    async addUsers(): Promise<Users> {
        this.users = await this.loadData(() => new Users().load(), 'Пользователи подключены');
        return this.users;
    }

    private async sendTemporaryMessage(chatId: number, message: string) {
        try {
            const msg = await this.bot.telegram.sendMessage(chatId, message);
            setTimeout(() => {
                this.bot.telegram.deleteMessage(msg.chat.id, msg.message_id).catch(console.error);
            }, 30 * 1000);
        } catch (error) {
            console.error(error);
        }
    }
}
