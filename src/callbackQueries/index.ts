import keyboard from "./settings/keyboard";
import updateSettings from "./settings/updateSettings";
import paidStatus from "./paidStatus";
import setDutyDay from "./setDutyDay";
import setGroup from "./setGroup";
import userPaid from "./userPaid";
import userStatus from "./userStatus";
import vipStatus from "./vipStatus";


export default{
    paidStatus,setDutyDay,setGroup,userPaid,userStatus,vipStatus,
    settings: {
        keyboard,updateSettings
    }
}