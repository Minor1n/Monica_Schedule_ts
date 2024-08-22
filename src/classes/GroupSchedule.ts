import XLSX from "xlsx";
import {bot} from "../index";


export class GroupSchedule{
    html:string
    link:string
    private readonly groupName:string
    constructor(groupName:string,html:string,link:string) {
        this.groupName = groupName
        this.html = html
        this.link = link
    }

    private setSchedule(html:string,link:string){
        this.html = html
        this.link = link
        bot.connection.query(`UPDATE groups SET schedule = '${html}' WHERE name = '${this.groupName}'`)
    }

    async generateSchedule(response:Response,link:string): Promise<string>{
        const workbook = XLSX.read(Buffer.from(await response.clone().arrayBuffer()));
        const sheetNameList = workbook.SheetNames;
        const worksheet = workbook.Sheets[sheetNameList[1]];
        const arr: string[] = [];

        for (let key in worksheet) {
            if (key.startsWith('B') && worksheet[key].v === this.groupName) {
                const startRow = Number(key.slice(1)) - 2;
                const endRow = startRow + 27;

                for (let i = startRow; i <= endRow; i++) {
                    const content = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(column =>
                        worksheet[`${column}${i}`] ? `<td><b>${worksheet[`${column}${i}`].v}</b></td>` : `<td></td>`
                    ).join(' ');

                    const row = `<tr>${content}</tr>`;
                    arr.push((i - startRow + 1) % 4 === 0 ? `${row}<tr><td colspan="7" class="line"></td></tr>` : row);
                }
                break;
            }
        }

        const formattedArr = arr.map(x => x.replace(/ +/g, ' '));
        const result = formattedArr.join('');

        this.setSchedule(result, link);

        return result;
    }
}