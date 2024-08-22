import {readFileSync} from "node:fs";
import path from "node:path";
import {bot} from "../index";

export function home(dirname: string, userId: number): { body: string } {
    const user = bot.users.getUser(userId);
    if (!user || user.payment.status === 0) {
        return { body: generateBlockedMessage() };
    }
    return { body: loadHTML(dirname, 'home') };
}

export function duty(dirname: string, userId: number): { body: string } {
    const user = bot.users.getUser(userId);
    if (!user || user.payment.status === 0) {
        return { body: generateBlockedMessage() };
    }
    return { body: loadHTML(dirname, 'duty') };
}

export function profile(dirname: string): { body: string } {
    return { body: loadHTML(dirname, 'profile') };
}

export function settings(dirname: string): { body: string } {
    return { body: loadHTML(dirname, 'settings') };
}


function loadHTML(dirname: string, filename: string): string {
    return readFileSync(path.join(dirname, `/site/${filename}.html`), 'utf-8');
}

function generateBlockedMessage(): string {
    return `<table><tr><td><b class="profileB">Вы заблокированы или еще не подключены к боту!</b></td></tr></table>`;
}