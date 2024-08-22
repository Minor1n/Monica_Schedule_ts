import {Group} from "./Group";
import {bot} from "../index";
import {MysqlError} from "mysql";
import {IGroup} from "../interfaces/IGroup";


export class Groups {
    all: Group[] = [];
    private map: Map<string,Group> = new Map()

    constructor() {}

    async load(): Promise<Groups> {
        const groups = await querySQL.all();
        this.all = await Promise.all(groups.map(async (group) => {
            const newGroup = await new Group().load(group.name, group.schedule.html)
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
}

const querySQL = {
    all: async (): Promise<IGroup[]> => {
        return new Promise((resolve, reject) => {
            bot.connection.query('SELECT * FROM groups', (err: MysqlError | null, result: IGroup[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Groups'));
                } else {
                    resolve(result);
                }
            });
        });
    }
};