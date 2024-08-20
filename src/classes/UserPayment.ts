import {UserReferral} from "./UserReferral";
import {connection} from "../index";

interface PaymentI{
    id:number;
    status:number;
    price:number;
    paid:'true'|'false'
    referral:UserReferral
}

export class UserPayment implements PaymentI{
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

    get paid(): 'true' | 'false' {
        return this._paid;
    }

    get price(): number {
        return this._price;
    }

    get status(): number {
        return this._status;
    }

    set paid(value: 'true' | 'false') {
        this._paid = value;
        this.updateField('paidWhenever', value);
    }

    set status(value: number) {
        this._status = value;
        this.updateField('payment', value);
    }

    private updateField(field: string, value: string | number) {
        const query = `UPDATE users SET ${field} = ? WHERE userId = ?`;
        connection.query(query, [value, this.id], (err) => {
            if (err) {
                console.error(`SQL ERROR: ${err.message}`);
            }
        });
    }
}