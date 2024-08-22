import { Telegraf } from "telegraf";
import { config } from "../config";
import { createPool, Pool } from "mysql";
import { Gradients } from "./Gradients";
import { Groups } from "./Groups";
import { Users } from "./Users";
import { IBot } from "../interfaces/IBot";

const databaseConfig = {
    host: config.SQLHOST,
    user: config.SQLUSER,
    database: config.SQLDATABASE,
    password: config.SQLPASSWORD,
};

export class Bot extends Telegraf implements IBot{
    connection: Pool;
    gradients!: Gradients;
    groups!: Groups;
    users!: Users;

    constructor() {
        super(config.TOKEN);
        this.connection = createPool(databaseConfig);
    }

    launchBot() {
        this.launch();
        this.sendTemporaryMessage(6018898378, 'Бот запущен!');
        console.log('Бот запущен')
    }

    private async loadData<T>(dataLoader: () => Promise<T>, message: string): Promise<T> {
        const data = await dataLoader();
        await this.sendTemporaryMessage(6018898378, message);
        console.log(message)
        return data;
    }

    async addGradients(){
        this.gradients = await this.loadData(() => new Gradients().load(), 'Градиенты подключены');
    }

    async addGroups(){
        this.groups = await this.loadData(() => new Groups().load(), 'Группы подключены');
    }

    async addUsers(){
        this.users = await this.loadData(() => new Users().load(), 'Пользователи подключены');
    }

    private async sendTemporaryMessage(chatId: number, message: string) {
        try {
            const msg = await this.telegram.sendMessage(chatId, message);
            setTimeout(() => {
                this.telegram.deleteMessage(msg.chat.id, msg.message_id).catch(console.error);
            }, 30 * 1000);
        } catch (error) {
            console.error(error);
        }
    }
}
