import User from "@classes/users/User";
import {Markup} from "telegraf";

export default async (user: User) => {
    return [
        [
            Markup.button.callback(`Дежурства: ${user.settings.duty}`, `settingsDuty${user.info.id}`),
            Markup.button.callback(`Расписание: ${user.settings.schedule}`, `settingsSchedule${user.info.id}`),
        ],
        [
            Markup.button.callback(`Общие замены: ${user.settings.replacement}`, `settingsReplacement${user.info.id}`),
            Markup.button.callback(`Замены группы: ${user.settings.groupReplacement}`, `settingsGroupReplacement${user.info.id}`)
        ]
    ];
}