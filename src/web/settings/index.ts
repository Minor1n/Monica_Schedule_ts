import duty from "@web/settings/notifications/duty";
import groupReplacement from "@web/settings/notifications/groupReplacement";
import replacement from "@web/settings/notifications/replacement";
import schedule from "@web/settings/notifications/schedule";
import tableNotification from "@web/settings/notifications/table";
import background from "@web/settings/theme/background";
import lightMode from "@web/settings/theme/lightMode";
import tableTheme from "@web/settings/theme/table";


export default {
    notifications:{
        duty,
        groupReplacement,
        replacement,
        schedule,
        table:tableNotification,
    },
    theme:{
        background,
        lightMode,
        table:tableTheme
    }
}