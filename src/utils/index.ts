import mapPlayers from "@utils/mafia/mapPlayers";
import updatePlayersInfo from "@utils/mafia/updatePlayersInfo";

import alert from "@utils/payments/alert";
import generateUsersKeyboard from "@utils/payments/generateUsersKeyboard";
import groupIsPaid from "@utils/payments/groupIsPaid";
import preAlert from "@utils/payments/preAlert";
import recount from "@utils/payments/recount";
import setReferralKey from "@utils/payments/setReferralKey";

import duty from "@utils/tables/duty";
import replacement from "@utils/tables/replacement";
import schedule from "@utils/tables/schedule";

import options from "@utils/fetch/options";
import links from "@utils/fetch/links";
import cron from "@utils/fetch/cron";


export const mafia = {
    mapPlayers,
    updatePlayersInfo
}
export const payments = {
    alert,
    generateUsersKeyboard,
    groupIsPaid,
    preAlert,
    recount,
    setReferralKey
}
export const tables = {
    duty,
    replacement,
    schedule
}
export const fetchUtils = {
    options,
    links,
    cron
}