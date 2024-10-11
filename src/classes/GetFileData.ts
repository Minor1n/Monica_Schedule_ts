import WordExtractor from "word-extractor";
import {FileType} from "@types";

const extractor = new WordExtractor();

export default class GetFileData{
    private readonly buffer: Buffer
    private readonly fileType: FileType
    private data: string | undefined
    private replIgnore = ['Группа','ПАРА','ПРЕПОДАВАТЕЛЬ','ЗАМЕНА','РАСПИСАНИЮ']
    constructor(buffer:Buffer,fileType:FileType) {
        this.buffer = buffer
        this.fileType = fileType
    }
    private async getData():Promise<string>{
        const pdf = await import('pdf-parse');
        switch (this.fileType){
            case "doc":
                return (await extractor.extract(this.buffer)).getBody()
            case "pdf":
                return (await pdf.default(this.buffer)).text
        }
    }
    async getReplacementData():Promise<string[]>{
        this.data = await this.getData()
        return this.data.replace(/\t/g, ' ').split('\n').filter(x =>
            !this.replIgnore.some(prefix => x.startsWith(prefix)) && x.trim() !== '' && x.replace(/\s/g, '') !== 'ПО'
        )
    }
}