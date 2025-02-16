import {Scenes, session, Telegraf} from "telegraf";
import config from "@config";
import { createPool, type Pool } from "mysql";
import Gradients from "@classes/Gradients";
import Groups from "@classes/groups/Groups";
import Users from "@classes/users/Users";
import Replacements from "@classes/replacements/Replacements";
import MafiaSessions from "@classes/games/MafiaSessions";
import type IBot from "@interfaces/IBot";
import {scenes} from "@controllers";
import type IContext from "@interfaces/IContext";

export default class Bot extends Telegraf<IContext<any>> implements IBot{
    devMode:boolean = true
    connection: Pool;
    gamesConnection: Pool;
    gradients!: Gradients;
    groups!: Groups;
    users!: Users;
    replacements!:Replacements
    mafiaSessions!: MafiaSessions;
    stage = new Scenes.Stage<IContext<any>>(scenes);

    constructor() {
        super(config.TOKEN);
        this.connection = createPool(config.databaseConfig);
        this.gamesConnection = createPool(config.gamesDB);
        this.use(session())
        this.use(this.stage.middleware());
    }

    async launchBot() {
        await this.sendTemporaryMessage(6018898378, 'Бот запущен!');
        await this.launch();
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
