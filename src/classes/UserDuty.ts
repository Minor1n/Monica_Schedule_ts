import {connection} from "../index";

interface UserDutyI {
    id:number;
    count:number;
    day:-1|1|2|3|4|5|6|number;
    lastDate:number;
}

export class UserDuty implements UserDutyI{
    id:number;
    private _count: number;
    private _day: -1 | 1 | 2 | 3 | 4 | 5 | 6|number;
    private _lastDate: number;
    constructor(id:number,count:number,day:-1|1|2|3|4|5|6|number,lastDate:number) {
        this.id = id
        this._count = count
        this._day = day
        this._lastDate = lastDate
    }
    get count(){
        return this._count
    }
    get day(){
        return this._day
    }
    get lastDate(){
        return this._lastDate
    }
    set count(value){
        this._count = value
        connection.query(`UPDATE users SET duty = '${value}' WHERE userId = '${this.id}'`)
    }
    set day(value){
        this._day = value
        connection.query(`UPDATE users SET scheduleDate = '${value}' WHERE userId = '${this.id}'`)
    }
    set lastDate(value){
        this._lastDate = value
        connection.query(`UPDATE users SET dutyDate = '${value}' WHERE userId = '${this.id}'`)
    }
}