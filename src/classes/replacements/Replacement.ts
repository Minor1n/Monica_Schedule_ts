import {bot} from "@index";
import IReplacementParse from "@interfaces/IReplacementParse";

export default class Replacement{
    private readonly _date:number
    private readonly text:string[]
    private readonly _link: string
    private _html: string | undefined
    constructor(options:{date:number,text:string[],link:string}) {
        this._date = options.date
        this.text = options.text
        this._link = options.link
    }
    get date():number{
        return this._date
    }
    get link():string{
        return this._link
    }
    async getHtml():Promise<string>{
        let date = new Date(this._date)
        this._html = await this.generateHTML(`${`0${date.getDate()}`.slice(-2)}.${`0${date.getMonth()+1}`.slice(-2)}.${date.getFullYear()}`)
        return this._html
    }

    private async parseText():Promise<IReplacementParse[]>{
        const parseText: IReplacementParse[] = [];
        let i = 0;

        while (i < this.text.length) {
            const currentText = this.text[i];
            if (!currentText?.match(/ЗАМЕНЫ/g)) {
                const group = bot.groups.isGroupInText(currentText)||null;

                let textParts = [currentText];
                let index = 1;

                while (this.text[i + index] && !bot.groups.isGroupInText(String(this.text[i + index])) && !this.text[i + index].match(/ЗАМЕНЫ/g)) {
                    textParts.push(this.text[i + index]);
                    index++;
                }

                const textLine = textParts.join(' ').slice(group?.name.length ? group.name.length+1 : 0).replace(/ +/g, ' ');
                const [auditorium] = textLine.split(/\. (?=[А-Яа-я0-9(])|\) (?=[А-Яа-я0-9(])/g).reverse();
                const pairMatch = textLine.match(/[0-9]п([,\-])[0-9]п|[0-9]([,\-])[0-9]п|[0-9]п|[0-9]/);
                const pair = pairMatch ? pairMatch[0] : undefined;

                const cleanedTextLine = pair ? textLine.replace(pair, '').replace(auditorium, '').trim() : textLine.trim();

                parseText.push({ text: cleanedTextLine, group, pair, auditorium });
                i += textParts.length;
            } else {
                parseText.push({
                    text: `${currentText} ${this.text[i + 1]}`,
                    group: null,
                    pair: 'null',
                    auditorium: 'null'
                });
                i += 2;
            }
        }

        return parseText;
    }

    private async generateHTML(date:string): Promise<string>{
        const parseText = await this.parseText();
        const finalArr: string[] = [];
        const groupArr = new Map<string,string[]>()

        const checkBracket = (words: string[], index: number): boolean => {
            return !!(words[index + 1] && words[index + 1].startsWith('('));
        };

        const generateRow = (field: IReplacementParse, wordsGen: string): string => {
            return `<tr><td><b>${field.group?.name || ''}</b></td><td><b>${field.pair || ''}</b></td>${wordsGen}<td><b>${field.auditorium || ''}</b></td></tr>`;
        };

        const wordsGen = (words: string[]): string => {
            switch (words.length) {
                case 1:
                    return `<td colspan="2"><b>${words[0]}</b></td><td><b></b></td><td colspan="2"><b></b></td>`;
                case 2:
                    return `<td colspan="2"><b>${words[0]}</b></td><td><b></b></td><td colspan="2"><b>${words[1]}</b></td>`;
                case 3:
                    return `<td colspan="2"><b>${words[0]}</b></td><td><b>${words[1]}</b></td><td colspan="2"><b>${words[2]}</b></td>`;
                case 4:
                    return `<td><b>${words[0]}</b></td><td><b>${words[1]}</b></td><td></td><td><b>${words[2]}</b></td><td><b>${words[3]}</b></td>`;
                default:
                    return `<td colspan="5"><b>${words.join(' ')}</b></td>`;
            }
        };

        for (const field of parseText) {
            if (!field.group) {
                finalArr.push(
                    `<tr><td colspan="8"><b>${field.text}</b></td></tr>`,
                    `<tr><td><b>Группа</b></td><td><b>Пара</b></td><td colspan="2"><b>По расписанию</b></td><td><b><===></b></td><td colspan="2"><b>Замена</b></td><td><b>Аудитория</b></td></tr>`,
                    `<tr><td colspan="8" class="line"></td></tr>`
                );
            } else {
                const words = field.text.replace(/ +/g, ' ').match(/[А-Я][а-я]+ [А-Я].[А-Я].|\([а-я]+\)|\([А-Яа-я0-9 .]+ +[А-Яа-я0-9 .]+\)|[А-Яа-я0-9]+/g) || [];
                const words2: string[] = [];
                let index = 0;

                while (index < words.length) {
                    if (checkBracket(words, index)) {
                        const textArr = [words[index], `\n${words[index + 1]}`];
                        let nextIndex = 2;
                        while (checkBracket(words, index + nextIndex)) {
                            textArr.push(`\n${words[index + nextIndex]}`);
                            nextIndex++;
                        }
                        index += nextIndex;
                        words2.push(textArr.join(' '));
                    } else {
                        words2.push(words[index]);
                        index++;
                    }
                }

                const generatedWords = wordsGen(words2);
                const nextField = parseText[parseText.indexOf(field) + 1];
                const addLine = nextField?.group === null;

                const finalRow = generateRow(field, generatedWords)
                finalArr.push(finalRow);

                if(groupArr.has(field.group.name)){
                    groupArr.get(field.group.name)?.push(finalRow)
                }else{
                    groupArr.set(field.group.name,[finalRow])
                }

                if (addLine) {
                    finalArr.push(`<tr><td colspan="8" class="line"></td></tr>`);
                }
            }
        }
        bot.groups.all.forEach(group=>{
            if(groupArr.has(group.name)){
                const fields = groupArr.get(group.name)
                if(fields){
                    group.setReplacement(fields,date)
                }
            }else{
                const fields = ['<tr><td colspan="8"><b>Замены для вашей группы не найдены</b></td></tr>']
                group.setReplacement(fields,date)
            }
        })
        return finalArr.join('');
    }
}
