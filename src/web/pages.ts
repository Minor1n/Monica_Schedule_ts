import {readFileSync} from "node:fs";
import path from "node:path";
import {users} from "../index";


export function profile(dirname: string): { body: string } {
    return { body: loadHTML(dirname, 'profile') };
}

export function settings(dirname: string): { body: string } {
    return { body: loadHTML(dirname, 'settings') };
}

export function home(dirname: string, userId: number): { body: string } {
    const user = users.getUser(userId);
    if (!user || user.payment.status === 0) {
        return { body: generateBlockedMessage() };
    }
    return { body: loadHTML(dirname, 'home') };
}

function loadHTML(dirname: string, filename: string): string {
    return readFileSync(path.join(dirname, `/html/${filename}.html`), 'utf-8');
}

function generateBlockedMessage(): string {
    return `<table><tr><td><b class="profileB">Вы заблокированы или еще не подключены к боту!</b></td></tr></table>`;
}