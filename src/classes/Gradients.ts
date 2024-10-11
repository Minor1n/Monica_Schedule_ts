import {bot} from "@index";
import {MysqlError} from "mysql";
import IGradient from "@interfaces/IGradient";

export default class Gradients{
    private _light: IGradient[] = []
    private _dark: IGradient[] = []
    constructor() {}
    get light(): string {
        return this.getRandomGradient(this._light);
    }

    get dark(): string {
        return this.getRandomGradient(this._dark);
    }

    private getRandomGradient(gradients: IGradient[]): string {
        if (gradients.length === 0) return '';
        const index = Math.floor(Math.random() * gradients.length);
        return gradients[index].css;
    }

    async load(): Promise<Gradients> {
        const gradients = await querySQL.gradients();
        gradients.forEach(gradient => {
            if (gradient.type === 'light') {
                this._light.push(gradient);
            } else {
                this._dark.push(gradient);
            }
        });
        return this;
    }
}

const querySQL = {
    gradients: async (): Promise<IGradient[]> => {
        return new Promise((resolve, reject) => {
            bot.connection.query('SELECT * FROM gradients', (err: MysqlError | null, result: IGradient[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Gradients'));
                } else {
                    resolve(result);
                }
            })
        })
    }
}