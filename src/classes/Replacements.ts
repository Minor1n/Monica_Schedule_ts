import {bot} from "../index";
import {MysqlError} from "mysql";
import {IReplacement} from "../interfaces/IReplacement";


export class Replacements {
    private all: IReplacement[] = [];

    async load(): Promise<Replacements> {
        const replacements = await querySQL.replacements();
        this.all = replacements.reverse();
        return this;
    }

    insertReplacement(link: string, date: number, html: string): void {
        const replacement = { link, date, html }
        this.all.unshift(replacement);

        const query = 'INSERT INTO replacements (link, date, html) VALUES (?, ?, ?)';
        bot.connection.query(query, [link, date, html], (err) => {
            if (err) {
                throw new Error('SQL ERROR in Replacements - insert');
            }
        });
    }

    getReplacement(index: number): IReplacement | undefined {
        return this.all[index];
    }
}

const querySQL = {
    replacements: async (): Promise<IReplacement[]> => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM replacements';
            bot.connection.query(query, (err: MysqlError | null, result: IReplacement[]) => {
                if (err) {
                    reject(new Error('SQL ERROR in Replacements - select'));
                } else {
                    resolve(result);
                }
            });
        });
    }
};