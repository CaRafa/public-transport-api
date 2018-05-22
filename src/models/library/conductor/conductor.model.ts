export interface Conductor {
    _id?: string,
    name?: string,
    lastName?: string,
    ci?: number,
    transports?: any,
    license?:number,
    birthday?:string,
    cell?:string,
    schedule?: any,
    status?:boolean
}
