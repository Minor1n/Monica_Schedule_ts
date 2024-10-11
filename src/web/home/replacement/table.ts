import {bot} from "@index";

interface IQuery{
    page:string;
}

interface IResolve{
    table: string;
}

export default async (query: IQuery): Promise<IResolve> => {
    const replacement = bot.replacements.getReplacement(Number(query.page));
    const table = replacement?.html ?? 'null';
    return { table };
};