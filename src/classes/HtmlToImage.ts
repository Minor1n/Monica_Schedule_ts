import nodeHtmlToImage from "node-html-to-image";
import config from "@config";

export default class HtmlToImage{
    private readonly gradient:string
    private readonly html:string
    constructor(gradient:string, html:string) {
        this.gradient = gradient
        this.html = html
    }
    async getImage(): Promise<Buffer> {
        const fullHtml = `${config.htmlStart1}${this.gradient}${config.htmlStart2}${this.html}${config.htmlEnd}`;
        return <Buffer> await nodeHtmlToImage({
            html: fullHtml,
            puppeteerArgs: config.puppeteer
        });
    }
}