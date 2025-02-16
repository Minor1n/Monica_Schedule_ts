import {bot} from "@index";
import {MysqlError} from "mysql";
import User from "./User";
import HtmlToImage from "@classes/HtmlToImage";
import IUserQuery from "@interfaces/IUserQuery";
import {payments} from "@utils";

export default class Users{
    private map:Map<number,User> = new Map()
    private _all: User[] = []
    constructor() {}
    async load(): Promise<Users> {
        const users = await querySQL.all();
        this._all = await Promise.all(users.map(async (user) => {
            const newUser = await new User().load(user.userId, user);
            this.map.set(user.userId, newUser);
            return newUser;
        }));
        return this;
    }

    async createUser(userId: number, userName: string, payment: number, name: string, refKey: string): Promise<void> {
        return new Promise((resolve, reject) => {
            bot.connection.query(
                'INSERT INTO users (userId, userName, payment, name, refKey) VALUES (?, ?, ?, ?, ?)',
                [userId, userName, payment, name, refKey],
                async (err: MysqlError | null, result: IUserQuery[]) => {
                    if (err) {
                        return reject(new Error('SQL ERROR in Users'));
                    }
                    try {
                        const newUser = await new User().load(userId, { res: result[0] });
                        this.map.set(userId, newUser);
                        this._all.push(newUser);
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        });
    }

    getUser(userId: number): User | undefined {
        return this.map.get(userId);
    }

    getUserByRefKey(refKey:string){
        return this._all.find(user=>user.payment.referral.key === refKey)
    }

    get all(): User[] {
        return this._all;
    }

    getGroupUsers(groupName:string):User[]{
        return this._all.filter(user=>user.info.groupName === groupName)
    }

    async sendPhoto(image: Buffer, name: string, settings: 'duty' | 'schedule' | 'replacement' | 'groupReplacement', groups: boolean, html?: string): Promise<void> {
        await Promise.all(this._all.map(async (user) => {
            const gradient = user.settings.theme;
            const img = html && gradient !== 'standard' ? await new HtmlToImage(gradient, html).getImage() : image;
            const groupTg = groups ? await payments.groupIsPaid(user) : true;

            if (user.payment.status !== 0 && user.settings[settings] === 'on' && groupTg) {
                if(!bot.devMode||user.info.id === 6018898378){
                    user.sendPhoto(img, name);
                }
            }
        }));
    }

    sendText(text:string){
        for(let user of this._all){
            if (user.payment.status !== 0) {
                if(!bot.devMode||user.info.id === 6018898378){
                    user.sendText(text);
                }
            }
        }
    }
}

const querySQL = {
    all: async (): Promise<IUserQuery[]> => {
        return new Promise((resolve, reject) => {
            bot.connection.query('SELECT * FROM users', (err: MysqlError | null, result: IUserQuery[]) => {
                if (err) {
                    return reject(new Error('SQL ERROR in Users'));
                }
                resolve(result);
            });
        });
    }
}