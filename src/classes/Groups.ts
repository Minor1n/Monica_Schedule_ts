import {Group} from "./Group";
import {bot} from "../index";
import {MysqlError} from "mysql";
import XLSX from "xlsx";
import {IGroupQuery} from "../interfaces/IGroupQuery";


export class Groups {
    all: Group[] = [];
    private map: Map<string,Group> = new Map()

    constructor() {}

    async load(): Promise<Groups> {
        const groups = await querySQL.all();
        this.all = await Promise.all(groups.map(async (group) => {
            const newGroup = await new Group().load(group.name, group.schedule, group.replacement)
            this.map.set(group.name, newGroup);
            return newGroup
        }));
        return this;
    }

    isGroupInText(text: string): Group | undefined {
        text = text.replace(' ', '-').toLowerCase();
        return this.all.find(group => text.includes(group.name.toLowerCase()));
    }

    getGroup(groupName:string){
        return this.map.get(groupName)
    }

    async parseGroups(link:string):Promise<string>{
        const response = await fetch(link)
        const workbook = XLSX.read(Buffer.from(await response.clone().arrayBuffer()));
        const sheetNameList = workbook.SheetNames;
        const worksheet = workbook.Sheets[sheetNameList[1]];
        const arr: string[] = []
        for (let key in worksheet) {
            if (key.startsWith('B') && worksheet[key].v.trim().match(/^[А-Я]+-[0-9][0-9]$|^[А-Я]+-[0-9][0-9][а-я]$/ig)){
                if(!this.getGroup(worksheet[key].v.trim())){
                    await this.setGroup(worksheet[key].v.trim())
                    arr.push(worksheet[key].v.trim())
                }
            }
        }
        return `Добавлены группы: ${arr.join(', ')}`
    }

    private setGroup(groupName:string):Promise<void>{
        return new Promise((resolve, reject) => {
            bot.connection.query(
                'INSERT INTO groups (name) VALUES (?)',
                [groupName],
                async (err: MysqlError | null) => {
                    if (err) {
                        return reject(new Error('SQL ERROR in setGroup'));
                    }
                    try {
                        const group = await new Group().load(groupName,'null');
                        this.map.set(groupName,group);
                        this.all.push(group);
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        })
    }
}

const querySQL = {
    all: async (): Promise<IGroupQuery[]> => {
        return new Promise((resolve, reject) => {
            bot.connection.query('SELECT * FROM groups', (err: MysqlError | null, result: IGroupQuery[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Groups'));
                } else {
                    resolve(result);
                }
            });
        });
    }
};