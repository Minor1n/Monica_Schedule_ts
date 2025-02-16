import {bot} from "@index";
import type IUserDuty from "@interfaces/IUserDuty";
import type {UserDutyDayType} from "@types";

export default class UserDuty implements IUserDuty {
    id: number;
    private _count: number;
    private _day: UserDutyDayType | number;
    private _lastDate: number;

    constructor(id: number, count: number, day: UserDutyDayType | number, lastDate: number) {
        this.id = id;
        this._count = count;
        this._day = day;
        this._lastDate = lastDate;
    }

    get count(): number {
        return this._count;
    }

    get day(): UserDutyDayType | number {
        return this._day;
    }

    get lastDate(): number {
        return this._lastDate;
    }

    set count(value: number) {
        this._count = value;
        this.updateDatabase('dutyCount', value);
    }

    set day(value: UserDutyDayType | number) {
        this._day = value;
        this.updateDatabase('dutyDay', value);
    }

    set lastDate(value: number) {
        this._lastDate = value;
        this.updateDatabase('dutyLastDate', value);
    }

    private updateDatabase(field: string, value: number | UserDutyDayType) {
        const query = `UPDATE users SET ${field} = ? WHERE userId = ?`;
        bot.connection.query(query, [value, this.id], (err) => {
            if (err) {
                console.error(`SQL ERROR: ${err.message}`);
            }
        });
    }
}