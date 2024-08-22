import type {User} from "../../../classes";


const bells = new Map<'on' | 'off', string>([
    ['off', `
    <svg style="width: 5vw; height: auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.909 5.823C6.333 6.744 6 7.833 6 9v2.756c0 .402-.293.849-.901 1.489-.68.717-1.099 1.688-1.099 2.756 0 1.105.895 2 2 2h10c.834 0 1.549-.511 1.849-1.237L16 14.914V16H7H6c0-.534.208-1.018.55-1.377C7.11 14.034 8 13.05 8 11.756V9c0-.61.137-1.188.381-1.705L6.909 5.823zM16 12.086V9c0-2.209-1.791-4-4-4-0.871 0-1.677.279-2.334.752L8.239 4.325C9.268 3.496 10.576 3 12 3c3.314 0 6 2.686 6 6v5.086l-2-2z" fill="#000"/>
      <path d="M3 3L21 21" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.798 19.877c-.166.342-.426.629-.749.828-.324.199-.697.302-1.077.297-.38-.005-.75-.118-1.067-.326-.317-.208-.569-.502-.726-.848" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 3V4" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `],
    ['on',`
    <svg style="width: 5vw; height: auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.825 13.934L5.1 13.2452L5.825 13.934ZM8 9C8 6.791 9.791 5 12 5V3C8.686 3 6 5.686 6 9H8ZM8 11.756V9H6V11.756H8ZM6 16C6 15.466 6.208 14.982 6.55 14.623L5.1 13.245C4.419 13.962 4 14.933 4 16H6ZM7 16H6V18H7V16ZM17 16H7V18H17V16ZM18 16H17V18H18V16ZM17.45 14.623C17.792 14.982 18 15.466 18 16H20C20 14.933 19.581 13.962 18.9 13.245L17.45 14.623ZM16 9V11.756H18V9H16ZM12 5C14.209 5 16 6.791 16 9H18C18 5.686 15.314 3 12 3V5ZM18.9 13.245C18.292 12.605 18 12.158 18 11.756H16C16 13.05 16.891 14.034 17.45 14.623L18.9 13.245ZM4 16C4 17.105 4.895 18 6 18V16H4ZM18 18C19.105 18 20 17.105 20 16H18V18ZM6 11.756C6 12.158 5.708 12.605 5.1 13.245L6.55 14.623C7.109 14.034 8 13.05 8 11.756H6Z" fill="#000"/>
      <path d="M13.798 19.877C13.631 20.218 13.371 20.505 13.048 20.704C12.725 20.902 12.352 21.005 11.972 21C11.593 20.995 11.222 20.881 10.905 20.674C10.587 20.466 10.335 20.172 10.179 19.826" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 3V4" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `]
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