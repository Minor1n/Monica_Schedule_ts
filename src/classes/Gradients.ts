import {connection} from "../index";
import {MysqlError} from "mysql";

type GradientType = 'light'|'dark'

interface GradientI{
    css: string
    type: GradientType
}

class Gradient implements GradientI{
    css: string;
    type: GradientType
    constructor(res:GradientI) {
        this.css = res.css
        this.type = res.type
    }
}

export class Gradients{
    private _light: GradientI[] = []
    private _dark: GradientI[] = []
    constructor() {}
    get light(): string {
        return this.getRandomGradient(this._light);
    }

    get dark(): string {
        return this.getRandomGradient(this._dark);
    }

    private getRandomGradient(gradients: Gradient[]): string {
        if (gradients.length === 0) return '';
        const index = Math.floor(Math.random() * gradients.length);
        return gradients[index].css;
    }

    async load(): Promise<Gradients> {
        const gradients = await querySQL.gradients();
        gradients.forEach(gradient => {
            if (gradient.type === 'light') {
                this._light.push(new Gradient(gradient));
            } else {
                this._dark.push(new Gradient(gradient));
            }
        });
        return this;
    }
}

const querySQL = {
    gradients: async (): Promise<GradientI[]> => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM gradients', (err: MysqlError | null, result: GradientI[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Gradients'));
                } else {
                    resolve(result);
                }
            })
        })
    }
}