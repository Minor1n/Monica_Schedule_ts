import {bot} from "../../../index";


export default async (index: number): Promise<{ table: string }> => {
    const replacement = bot.replacements.getReplacement(index);
    const table = replacement?.html ?? 'null';
    return { table };
};