import {connection} from "../index";
import {MysqlError} from "mysql";

interface ReplacementI{
    link:string
    date:number
    html:string
}

class ReplacementSQL implements ReplacementI{
    date: number
    html: string
    link: string
    constructor(res:ReplacementI) {
        this.html = res.html
        this.date = res.date
        this.link = res.link
    }
}
export class Replacements {
    private all: ReplacementSQL[] = [];

    async load(): Promise<Replacements> {
        const replacements = await querySQL.replacements();
        this.all = replacements.map(x => new ReplacementSQL(x)).reverse();
        return this;
    }

    insertReplacement(link: string, date: number, html: string): void {
        const replacement = new ReplacementSQL({ link, date, html });
        this.all.push(replacement);

        const query = 'INSERT INTO replacements (link, date, html) VALUES (?, ?, ?)';
        connection.query(query, [link, date, html], (err) => {
            if (err) {
                throw new Error('SQL ERROR in Replacements - insert');
            }
        });
    }

    getReplacement(index: number): ReplacementSQL | undefined {
        return this.all[index];
    }
}

const querySQL = {
    replacements: async (): Promise<ReplacementI[]> => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM replacements';
            connection.query(query, (err: MysqlError | null, result: ReplacementI[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Replacements - select'));
                } else {
                    resolve(result);
                }
            });
        });
    }
};