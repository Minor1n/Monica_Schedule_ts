import nodeHtmlToImage from "node-html-to-image";
import {config} from "../config";


export class HtmlToImage{
    private _image!: string | Buffer | (string | Buffer)[]
    private readonly gradient:string
    private readonly html:string
    constructor(gradient:string, html:string) {
        this.gradient = gradient
        this.html = html
    }
    async getImage(): Promise<string | Buffer | (string | Buffer)[]>{
        let value: string | Buffer | (string | Buffer)[] = await nodeHtmlToImage({
            html: `${config.htmlStart1}${this.gradient}${config.htmlStart2}${this.html}${config.htmlEnd}`,
            puppeteerArgs: config.puppeteer
        })
        this._image = value
        return value
    }
}