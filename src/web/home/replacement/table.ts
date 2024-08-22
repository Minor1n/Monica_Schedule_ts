import {Replacements} from "../../../classes";


export default async (index: number): Promise<{ table: string }> => {
    const replacements = await new Replacements().load();
    const replacement = replacements.getReplacement(index);
    const table = replacement?.html ?? 'null';
    return { table };
};