export type SettingsType = 'scheduleLink'|'replacementLink'

export interface ISettings{
    type:SettingsType
    value:string
    number:number
}