import type {User} from "../../../classes";

const lightSvg = new Map<0 | 1, string>([
    [0, `
    <svg style="width: 5vw; height: auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path d="M12 3v1M12 20v1M4 12H3M6.314 6.314L5.5 5.5M17.686 6.314L18.5 5.5M6.314 17.69L5.5 18.5M17.686 17.69L18.5 18.5M21 12h-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
   `],
    [1, `
    <svg style="width: 5vw; height: auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path d="M3.32 11.684c0 4.97 4.03 9 9 9 3.787 0 7.028-2.339 8.357-5.651a9.172 9.172 0 0 1-3.357.651c-4.97 0-9-4.03-9-9 0-1.18.232-2.32.645-3.353C5.656 4.66 3.32 7.9 3.32 11.684z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
   `]
]);

export default(user: User): string => {
    return `
<tr class="fiveHeight"><td colspan="4"><b class="profileB">Настройки темы</b></td></tr>
<tr class="fiveHeight">
    <td colspan="2"><b class="profileB">Темная тема:</b></td>
    <td colspan="2">
        <button style="width: 100%;" onclick="updateSettingsThemeLightMode()">
            ${lightSvg.get(user.settings.lightMode)}
        </button>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Фон:</b></td>
    <td>
        <form style="overflow: hidden;" name="myForm">
            <svg style="width: 5vw; height: auto; padding-right: 1vw; float: right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span style="overflow: hidden; display: block"><input style="width: 100%; height: 100%" class="inputP" type="url" id="theme" name="theme" required/></span>
        </form>
    </td>
    <td><button onclick="updateSettingsThemeCustom()">
        <svg style="width: 5vw; height: auto;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6C4 4.89543 4.89543 4 6 4H12H14.1716C14.702 4 15.2107 4.21071 15.5858 4.58579L19.4142 8.41421C19.7893 8.78929 20 9.29799 20 9.82843V12V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 4H13V7C13 7.55228 12.5523 8 12 8H9C8.44772 8 8 7.55228 8 7V4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 15C7 13.8954 7.89543 13 9 13H15C16.1046 13 17 13.8954 17 15V20H7V15Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button></td>
    <td><button onclick="updateSettingsThemeStandard()">
        <svg style="width: 5vw; height: auto;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V8M3 8H8M3 8L6 5.29168C7.59227 3.86656 9.69494 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.71683 21 4.13247 18.008 3.22302 14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button></td>
</tr>
    `;
}