import {BaseScene} from "telegraf/scenes";
import type IContext from "@interfaces/IContext";
//CallbackQueries
import keyboard from "@controllers/callbackQueries/settings/keyboard";
import updateSettings from "@controllers/callbackQueries/settings/updateSettings";
import paidStatus from "@controllers/callbackQueries/paidStatus";
import replacement from "@controllers/callbackQueries/replacement";
import schedule from "@controllers/callbackQueries/schedule";
import setGroup from "@controllers/callbackQueries/setGroup";
import userPaid from "@controllers/callbackQueries/userPaid";
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
import CSetDutyDate from "@controllers/commands/setDutyDate";
import CSetGroup from "@controllers/commands/setGroup";
import setName from "@controllers/commands/setName";
import settings from "@controllers/commands/settings";
import start from "@controllers/commands/start";
import status from "@controllers/commands/status";
import theme from "@controllers/commands/theme";
import type IHear from "@interfaces/IHear";
import type ICommand from "@interfaces/ICommand";
//Scenes
import SceneUserPaid from "@controllers/scenes/userPaid";
import SceneSetName from "@controllers/scenes/setName";
import SceneSetReferralKey from "@controllers/scenes/setReferralKey";
import SceneSetTheme from "@controllers/scenes/setTheme";

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
    CSetDutyDate,
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
}

export const scenes: BaseScene<IContext<any>>[] = [
    SceneUserPaid,
    SceneSetName,
    SceneSetReferralKey,
    SceneSetTheme
]