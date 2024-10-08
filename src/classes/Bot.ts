import { Telegraf } from "telegraf";
import { config } from "../config";
import { createPool, Pool } from "mysql";
import { Gradients } from "./Gradients";
import { Groups } from "./Groups";
import { Users } from "./Users";
import { IBot } from "../interfaces/IBot";
import {Replacements} from "./Replacements";
import {MafiaSessions} from "./games/MafiaSessions";

const databaseConfig = {
    host: config.SQLHOST,
    user: config.SQLUSER,
    database: config.SQLDATABASE,
    password: config.SQLPASSWORD,
};

const gamesDB = {
    host: config.SQLHOST,
    user: config.SQLUSER,
    database: config.SQLDATABASE_MAFIA,
    password: config.SQLPASSWORD,
};

export class Bot extends Telegraf implements IBot{
    devMode:boolean = false
    connection: Pool;
    gamesConnection: Pool;
    gradients!: Gradients;
    groups!: Groups;
    users!: Users;
    replacements!:Replacements
    mafiaSessions!: MafiaSessions;

    constructor() {
        super(config.TOKEN);
        this.connection = createPool(databaseConfig);
        this.gamesConnection = createPool(gamesDB);
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

    async addReplacements(){
        this.replacements = await this.loadData(() => new Replacements().load(), 'Замены подключены');
    }

    async addMafiaSessions(){
        this.mafiaSessions = await this.loadData(() => new MafiaSessions().load(), 'Мафия подключена');
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
