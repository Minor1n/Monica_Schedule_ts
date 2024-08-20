import pdf from "pdf-parse";
import WordExtractor from "word-extractor";
const extractor = new WordExtractor();


export type fileType = 'pdf'|'doc'


export class GetFileData{
    private readonly buffer: Buffer
    private readonly fileType: fileType
    private data: string | undefined
    private replIgnore = ['Группа','ПАРА','ПРЕПОДАВАТЕЛЬ','ЗАМЕНА','РАСПИСАНИЮ']
    constructor(buffer:Buffer,fileType:fileType) {
        this.buffer = buffer
        this.fileType = fileType
    }
    private async getData():Promise<string>{
        switch (this.fileType){
            case "doc":
                return (await extractor.extract(this.buffer)).getBody()
            case "pdf":
                return (await pdf(this.buffer)).text
        }
    }
    async getReplacementData():Promise<string[]>{
        this.data = await this.getData()
        return this.data.replace(/\t/g, ' ').split('\n').filter(x =>
            !this.replIgnore.some(prefix => x.startsWith(prefix)) && x.trim() !== '' && x.replace(/\s/g, '') !== 'ПО'
        )
    }
}