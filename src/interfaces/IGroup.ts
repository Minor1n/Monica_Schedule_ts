import {GroupSchedule, User} from "../classes";
import {GroupDuty} from "../classes/GroupDuty";
import {GroupReplacement} from "../classes/GroupReplacement";

export interface IGroup{
    name: string
    schedule: GroupSchedule
    replacement: GroupReplacement
    users:User[]
    duty:GroupDuty
}