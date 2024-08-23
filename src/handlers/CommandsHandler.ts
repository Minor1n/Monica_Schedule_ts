import {bot} from "../index";
import commands from "../commands";

const commandHandlers: Record<string, (ctx: any) => Promise<void>> = {
    'start': commands.start,
    'fetch': (ctx) => commands.fetch(ctx.chat.id, ctx),
    'send': commands.send,
    'schedule': commands.schedule,
    'theme': commands.theme,
    'status': commands.status,
    'settings': commands.settings,
    'profile': commands.profile,
    'setname': commands.setName,
    'setgroup': commands.setGroup,
    'referral': commands.referral,
    'paid': commands.paid,
    'replacement': commands.replacement,
    'restart': commands.restart,
    'duty': commands.duty,
    'setdutydate': commands.setDutyDay,
    'parsegroups': commands.parseGroups
};

export default () => {
    Object.entries(commandHandlers).forEach(([command, handler]) => {
        bot.command(command, async (ctx) => {
            await handler(ctx);
        });
    });
};