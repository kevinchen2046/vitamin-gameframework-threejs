export interface IMsg{
    routId: number
    __id__?: number
    data?:any
}

export class Net {
    public request(msg: IMsg, handler: { caller: any, method: Function, args?: any }) {
        //todo
        window.setTimeout(()=>{
            handler.method.call(handler.caller,[1,2,3,4,5,6,7,8,9,10]);
        },1000);
    }

    public notify(msg: IMsg) {

    }
}