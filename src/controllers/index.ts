//CallbackQueries
import keyboard from "@controllers/callbackQueries/settings/keyboard";
import updateSettings from "@controllers/callbackQueries/settings/updateSettings";
import paidStatus from "@controllers/callbackQueries/paidStatus";
import replacement from "@controllers/callbackQueries/replacement";
import schedule from "@controllers/callbackQueries/schedule";
import setGroup from "@controllers/callbackQueries/setGroup";
import userPaid from "@controllers/callbackQueries/userPaid";
import userStatus from "@controllers/callbackQueries/userStatus";
import vipStatus from "@controllers/callbackQueries/vipStatus";
import setDutyDay from "@controllers/callbackQueries/setDutyDay";
//Hears
import duty from "@controllers/hears/duty";
//Commands
import CDuty from "@controllers/commands/duty"
import fetch from "@controllers/commands/fetch";
import paid from "@controllers/commands/paid";
import parseGroups from "@controllers/commands/parseGroups";
import profile from "@controllers/commands/profile";
import referral from "@controllers/commands/referral";
import CReplacement from "@controllers/commands/replacement"
import CSchedule from "@controllers/commands/schedule"
import restart from "@controllers/commands/restart";
import send from "@controllers/commands/send";
import CSetDutyDay from "@controllers/commands/setDutyDay";
import CSetGroup from "@controllers/commands/setGroup";
import setName from "@controllers/commands/setName";
import settings from "@controllers/commands/settings";
import start from "@controllers/commands/start";
import status from "@controllers/commands/status";
import theme from "@controllers/commands/theme";
import IHear from "@interfaces/IHear";
import ICommand from "@interfaces/ICommand";


export const commands:ICommand[] = [
    CDuty,
    fetch,
    paid,
    parseGroups,
    profile,
    referral,
    CReplacement,
    CSchedule,
    restart,
    send,
    CSetDutyDay,
    CSetGroup,
    setName,
    settings,
    start,
    status,
    theme
]

export const hears:IHear[] = [
    duty
]

export const callbackQueries = {
    settings:{
        keyboard,
        updateSettings
    },
    fetch:{
        replacement,
        schedule
    },
    paidStatus,
    setDutyDay,
    setGroup,
    userPaid,
    userStatus,
    vipStatus,
}