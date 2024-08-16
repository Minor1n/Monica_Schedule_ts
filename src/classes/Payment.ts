import {UserReferral} from "./UserReferral";
import {connection} from "../index";

interface PaymentI{
    id:number;
    status:number;
    price:number;
    paid:'true'|'false'
    referral:UserReferral
}

export class Payment implements PaymentI{
    id: number;
    private _paid: "true" | "false";
    private readonly _price: number;
    referral: UserReferral;
    private _status: number;

    constructor(id:number,paid:'true'|'false',price:number,status:number,referral:UserReferral) {
        this.id = id
        this._paid = paid
        this._price = price
        this._status = status
        this.referral = referral
    }

    get paid(): "true" | "false" {
        return this._paid;
    }
    get price(): number {
        return this._price;
    }
    get status(): number {
        return this._status;
    }

    set paid(value: "true" | "false") {
        this._paid = value;
        connection.query(`UPDATE users SET paidWhenever = '${value}' WHERE userId = '${this.id}'`)
    }
    set status(value: number) {
        this._status = value;
        connection.query(`UPDATE users SET payment = '${value}' WHERE userId = '${this.id}'`)
    }
}