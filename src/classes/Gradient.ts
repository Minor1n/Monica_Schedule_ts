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
    private _light:GradientI[] = []
    private _dark:GradientI[] = []
    constructor() {}
    get light(){
        return this._light[Math.floor(Math.random() * (this._light.length-1))].css
    }
    get dark(){
        return this._dark[Math.floor(Math.random() * (this._dark.length-1))].css
    }
    async load():Promise<Gradients>{
        let gradients = await querySQL.gradients()
        for(let gradient of gradients){
            gradient.type === 'light' ? this._light.push(new Gradient(gradient)):this._dark.push(new Gradient(gradient))
        }
        return this
    }
}

const querySQL = {
    gradients:async ():Promise<GradientI[]>=>{
        return new Promise(async function (resolve){
            connection.query('SELECT * FROM gradients', async (err: MysqlError | null, result:GradientI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Gradients')
                }else{
                    resolve(result)
                }
            })
        })
    }
}