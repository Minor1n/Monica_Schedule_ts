import {connection} from "../index";
import {User, UserT} from "./User";
import {MysqlError} from "mysql";
import {HtmlToImage} from "./HtmlToImage";
import {Functions} from "../functions";


export class Users{
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
            connection.query(
                'INSERT INTO users (userId, userName, payment, name, refKey) VALUES (?, ?, ?, ?, ?)',
                [userId, userName, payment, name, refKey],
                async (err: MysqlError | null, result: UserT[]) => {
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

    async sendPhoto(image: Buffer, name: string, settings: 'duty' | 'schedule' | 'replacement', groups: boolean, html?: string): Promise<void> {
        await Promise.all(this._all.map(async (user) => {
            const gradient = user.settings.theme;
            const img = html && gradient !== 'standard' ? await new HtmlToImage(gradient, html).getImage() : image;
            const groupTg = groups ? await Functions.payment.groupTG(user) : true;

            if (user.payment.status !== 0 && user.settings[settings] === 'on' && groupTg && user.info.id === 6018898378) {
                user.sendPhoto(img, name);
            }
        }));
    }

    sendText(text:string){
        for(let user of this._all){
            if (user.payment.status !== 0) {
                user.sendText(text);
            }
        }
    }
}

const querySQL = {
    all: async (): Promise<UserT[]> => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users', (err: MysqlError | null, result: UserT[]) => {
                if (err) {
                    return reject(new Error('SQL ERROR in Users'));
                }
                resolve(result);
            });
        });
    }
}