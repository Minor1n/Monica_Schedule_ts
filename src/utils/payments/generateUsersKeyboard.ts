import {bot} from "@index";

export default async(): Promise<{ text: string; callback_data: string }[][]> => {
    const sortedUsers = bot.users.all.sort((a, b) => a.info.name.localeCompare(b.info.name));
    const usersKeyboard: { text: string; callback_data: string }[][] = [];
    sortedUsers.forEach((user, index) => {
        if (index % 5 === 0) usersKeyboard.push([]);
        usersKeyboard[usersKeyboard.length - 1].push({ text: user.info.name, callback_data: `userPaid${user.info.id}` });
    });
    return usersKeyboard;
}