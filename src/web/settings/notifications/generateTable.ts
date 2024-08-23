import type {User} from "../../../classes";


const bells = new Map<'on' | 'off', string>([
    ['off', '<img src="assets/images/bellMute.svg" alt="bellMute" style="width: 5vw; height: auto"/>'],
    ['on','<img src="assets/images/bell.svg" alt="bellMute" style="width: 5vw; height: auto"/>']
]);

export default (user: User): string => {
    return `
<tr class="fiveHeight"><td colspan="2"><b class="profileB">Настройки уведомлений</b></td></tr>
<tr class="fiveHeight">
    <td><b class="profileB">Появление нового расписания:</b></td>
    <td style="min-width: 10vw">
        <button onclick="updateSettingsNotificationSchedule()">
            ${bells.get(user.settings.schedule)}
        </button>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Появление новых замен:</b></td>
    <td style="min-width: 10vw">
        <button onclick="updateSettingsNotificationReplacement()">
            ${bells.get(user.settings.replacement)}
        </button>
    </td>
</tr>
<tr class="fiveHeight">
    <td><b class="profileB">Рассылка таблицы дежурных за неделю:</b></td>
    <td style="min-width: 10vw">
        <button onclick="updateSettingsNotificationDuty()">
            ${bells.get(user.settings.duty)}
        </button>
    </td>
</tr>
`;
}