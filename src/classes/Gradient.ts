import {connection} from "../index";
import {MysqlError} from "mysql";

interface GradientI{
    css:string
}

class Gradient implements GradientI{
    css: string;
    constructor(res:GradientI) {
        this.css=res.css
    }
}

export class Gradients{
    private _light!:GradientI[]
    private _dark!:GradientI[]
    constructor() {}
    get light(){
        return this._light[Math.floor(Math.random() * (this._light.length-1))].css
    }
    get dark(){
        return this._dark[Math.floor(Math.random() * (this._dark.length-1))].css
    }
    async load():Promise<Gradients>{
        let light = await querySQL.light()
        let dark = await querySQL.dark()
        this._light = light.map(x=>new Gradient(x))
        this._dark = dark.map(x=>new Gradient(x))
        return this
    }
}

const querySQL = {
    light:async ():Promise<GradientI[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query('SELECT * FROM gradients', async (err: MysqlError | null, result:GradientI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Gradients')
                }else{
                    resolve(result)
                }
            })
        })
    },
    dark:async ():Promise<GradientI[]>=>{
        return new Promise(async function (resolve,reject){
            connection.query('SELECT * FROM replGradients', async (err: MysqlError | null, result:GradientI[]) => {
                if (err) {
                    throw new Error('SQL ERROR in Gradients')
                }else{
                    resolve(result)
                }
            })
        })
    }
}