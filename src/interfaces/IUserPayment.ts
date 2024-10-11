import UserReferral from "@classes/users/UserReferral";

export default interface IUserPayment {
    id:number;
    status:number;
    price:number;
    paid:'true'|'false'
    referral:UserReferral
}