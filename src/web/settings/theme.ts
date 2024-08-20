import {users} from "../../index";
import {config} from "../../config";
import {User} from "../../classes";


export const theme = (userId: number): { table: string } => {
    const user = users.getUser(userId);
    return { table: user ? generateTable(user) : config.notfoundMessagesSite.user };
};

export const bg = (userId: number, url: string): { table: string } => {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    user.settings.theme = url;
    return { table: generateTable(user) };
};

export const lightMode = (userId: number): { table: string } => {
    const user = users.getUser(userId);
    if (!user) return { table: config.notfoundMessagesSite.user };

    user.settings.switchLightMode();
    return { table: generateTable(user) };
};

const lightSvg = new Map<0|1,string>([
    [0,`<svg style="width: 5vw; height: auto" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`],
    [1,`<svg style="width: 5vw; height: auto" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`]
])

const generateTable = (user: User): string => {
    return `
<tr class="fiveHeight"><td colspan="4"><b class="profileB">Настройки темы</b></td></tr>
<tr class="fiveHeight">
    <td colspan="2"><b class="profileB">Темная тема:</b></td>
    <td colspan="2">
        <button style="width: 100%;" onclick="updateSettingsLightMode()">
            ${lightSvg.get(user.settings.lightMode)}
        </button>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Фон:</b></td>
    <td>
        <form style="overflow: hidden;" name="myForm">
            <svg style="width: 5vw; height: auto; padding-right: 1vw; float: right" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span style="overflow: hidden; display: block"><input style="width: 100%; height: 100%" class="inputP" type="url" id="theme" name="theme" required/></span>
        </form>
    </td>
    <td><button onclick="updateSettingsTheme()">
        <svg style="width: 5vw; height: auto;" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6C4 4.89543 4.89543 4 6 4H12H14.1716C14.702 4 15.2107 4.21071 15.5858 4.58579L19.4142 8.41421C19.7893 8.78929 20 9.29799 20 9.82843V12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 4H13V7C13 7.55228 12.5523 8 12 8H9C8.44772 8 8 7.55228 8 7V4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V20H7V15Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button></td>
    <td><button onclick="updateSettingsThemeStandard()">
        <svg style="width: 5vw; height: auto;" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V8M3 8H8M3 8L6 5.29168C7.59227 3.86656 9.69494 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.71683 21 4.13247 18.008 3.22302 14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button></td>
</tr>
    `;
}