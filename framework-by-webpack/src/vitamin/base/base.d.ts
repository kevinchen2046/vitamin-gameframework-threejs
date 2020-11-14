import { Net } from "../net/Net";
export declare abstract class ModelBase {
    initialize(): void;
    reset(): void;
}
export declare abstract class ViewBase {
    constructor();
    enter(...args: any[]): void;
    exit(): void;
    protected exec(cmdRoute: string, ...args: any[]): void;
}
export declare abstract class CommandBase {
    protected net: Net;
    constructor();
    exec(...args: any[]): Promise<any>;
}
