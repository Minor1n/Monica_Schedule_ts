import type {User} from "../../../classes";

const lightSvg = new Map<0 | 1, string>([
    [0, '<img src="assets/images/sun.svg" alt="sun" style="width: 5vw; height: auto"/>'],
    [1, '<img src="assets/images/moon.svg" alt="moon" style="width: 5vw; height: auto"/>']
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
            <img src="assets/images/pen.svg" alt="pen" style="width: 5vw; height: auto; padding-right: 1vw; float: right">
            <span style="overflow: hidden; display: block"><input style="width: 100%; height: 100%" class="inputP" type="url" id="theme" name="theme" required/></span>
        </form>
    </td>
    <td><button onclick="updateSettingsThemeCustom()">
        <img src="assets/images/drive.svg" alt="drive" style="width: 5vw; height: auto;">
    </button></td>
    <td><button onclick="updateSettingsThemeStandard()">
        <img src="assets/images/return.svg" alt="return" style="width: 5vw; height: auto;">
    </button></td>
</tr>
    `;
}