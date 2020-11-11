import { __execCmd, __injectCmdEnd, __injectInstance, __injectModel, __instance, __unInjectCmdEnd } from "./Injecter";
import { Net } from "../net/Net";

export abstract class ModelBase {
    public initialize() { }
    public reset() { }
}

export abstract class ViewBase {
    public constructor() {
        __injectModel(this);
        __injectInstance(this);
    }
    public enter(...args) {
        __injectCmdEnd(this);
    }
    public exit() {
        __unInjectCmdEnd(this);
    }
    protected exec(cmdRoute: string, ...args) {
        __execCmd(cmdRoute, ...args);
    }
}

export abstract class CommandBase {
    protected net: Net;
    constructor() {
        this.net = __instance(Net);
        __injectModel(this);
        __injectInstance(this);
    }
    public async exec(...args): Promise<any> { return Promise.resolve() }
}