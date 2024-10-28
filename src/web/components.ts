import IWebComponent from "@interfaces/IWebComponent";
import web from "@web";
import ISocketComponent from "@interfaces/ISocketComponent";

const standardRouterHandlers:IWebComponent[] = [
    { method: 'get', url: '/gradient', handler: web.gradient },
    { method: 'get', url: '/paymentStatus', handler: web.paymentStatus}
]

const homeRouterHandlers:IWebComponent[] = [
    { method: 'get', url: '/schedule/table', handler: web.home.schedule.table },
    { method: 'get', url: '/schedule/select', handler: web.home.schedule.select },
    { method: 'get', url: '/schedule/update', handler: web.home.schedule.update },
    { method: 'get', url: '/replacement/table', handler: web.home.replacement.table },
    { method: 'get', url: '/replacement/groupTable', handler: web.home.replacement.groupTable },
];

const dutyRouterHandlers:IWebComponent[] = [
    { method: 'get', url: '/table', handler: web.duty.table },
    { method: 'get', url: '/checkin', handler: web.duty.checkin },
];

const profileRouterHandlers:IWebComponent[] = [
    { method: 'get', url: '/info/table', handler: web.profile.info.table },
    { method: 'get', url: '/info/refKey', handler: web.profile.info.refKey },
    { method: 'get', url: '/info/monthPay', handler: web.profile.info.monthPay },
    { method: 'post', url: '/settings/group', handler: web.profile.settings.group },
    { method: 'post', url: '/settings/dutyDay', handler: web.profile.settings.dutyDay },
    { method: 'post', url: '/settings/name', handler: web.profile.settings.name },
];

const settingsRouterHandlers:IWebComponent[] = [
    { method: 'get', url: '/notifications/table', handler: web.settings.notifications.table },
    { method: 'post', url: '/notifications/schedule', handler: web.settings.notifications.schedule },
    { method: 'post', url: '/notifications/replacement', handler: web.settings.notifications.replacement },
    { method: 'post', url: '/notifications/groupReplacement', handler: web.settings.notifications.groupReplacement },
    { method: 'post', url: '/notifications/duty', handler: web.settings.notifications.duty },
    { method: 'get', url: '/theme/table', handler: web.settings.theme.table },
    { method: 'post', url: '/theme/background', handler: web.settings.theme.background },
    { method: 'post', url: '/theme/lightMode', handler: web.settings.theme.lightMode },
];

const mafiaRouterHandlers:IWebComponent[] = [
    { method: 'get', url: '/sessions', handler: web.games.mafia.session },
    { method: 'get', url: '/exit', handler: web.games.mafia.exit },
    { method: 'get', url: '/players', handler: web.games.mafia.players },
];

const sockets:ISocketComponent[] = [
    { url: 'setHost', handler: web.sockets.setHost },
    { url: 'joinPlayer', handler: web.sockets.joinPlayers },
    { url: 'setPlayers', handler: web.sockets.setPlayers },
]

export default {
    standardRouterHandlers,
    homeRouterHandlers,
    dutyRouterHandlers,
    profileRouterHandlers,
    settingsRouterHandlers,
    mafiaRouterHandlers,
    sockets
}