import {bot} from "../index";
import {Commands} from "../commands";

const commandHandlers: Record<string, (ctx: any) => Promise<void>> = {
    'start': Commands.start,
    'fetch': (ctx) => Commands.fetch(ctx.chat.id, ctx),
    'send': Commands.send,
    'schedule': Commands.schedule,
    'theme': Commands.theme,
    'status': Commands.status,
    'settings': Commands.settings,
    'profile': Commands.profile,
    'setname': Commands.setName,
    'setgroup': Commands.setGroup,
    'referral': Commands.referral,
    'paid': Commands.paid,
    'replacement': Commands.replacement,
    'restart': Commands.restart,
    'duty': Commands.duty,
    'setdutydate': Commands.setDutyDay
};

export const CommandsHandler = () => {
    Object.entries(commandHandlers).forEach(([command, handler]) => {
        bot.command(command, async (ctx) => {
            await handler(ctx);
        });
    });
};