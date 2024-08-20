import {connection} from "../index";
import {UserDutyDay} from "./User";

interface UserDutyI {
    id:number;
    count:number;
    day:UserDutyDay|number;
    lastDate:number;
}

export class UserDuty implements UserDutyI {
    id: number;
    private _count: number;
    private _day: UserDutyDay | number;
    private _lastDate: number;

    constructor(id: number, count: number, day: UserDutyDay | number, lastDate: number) {
        this.id = id;
        this._count = count;
        this._day = day;
        this._lastDate = lastDate;
    }

    get count(): number {
        return this._count;
    }

    get day(): UserDutyDay | number {
        return this._day;
    }

    get lastDate(): number {
        return this._lastDate;
    }

    set count(value: number) {
        this._count = value;
        this.updateDatabase('dutyCount', value);
    }

    set day(value: UserDutyDay | number) {
        this._day = value;
        this.updateDatabase('dutyDay', value);
    }

    set lastDate(value: number) {
        this._lastDate = value;
        this.updateDatabase('dutyLastDate', value);
    }

    private updateDatabase(field: string, value: number | UserDutyDay) {
        const query = `UPDATE users SET ${field} = ? WHERE userId = ?`;
        connection.query(query, [value, this.id], (err) => {
            if (err) {
                console.error(`SQL ERROR: ${err.message}`);
            }
        });
    }
}