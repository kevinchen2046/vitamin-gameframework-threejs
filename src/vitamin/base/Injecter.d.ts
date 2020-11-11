import { ModelBase } from "./base";
export declare class SimpleDispatcher {
    private _map;
    constructor();
    on(type: string, caller: any, listener: Function, priority?: number): void;
    off(type: string, caller: any, listener: Function): void;
    emit(type: string, ...args: any[]): void;
}
export declare function __getClassName(clazz: any): string;
/**
 * 单例装饰器
 * @param clazz 需要单例化的class对象
 */
export declare function Instance(clazz: any): (instance: any, property: string) => void;
export declare function __instance(clazz: any): any;
/**
 * 数据模块的装饰器
 * @param dependents 当前数据模块的依赖模块
 */
export declare function ModelClass(...dependents: any[]): (clazz: any) => void;
/**
 * 数据模块实例的装饰器
 * @param instance
 * @param property
 */
export declare function Model(instance: any, property: string): void;
export declare function __initializeModels(): void;
export declare function __injectModel(instance: any): void;
export declare function __injectInstance(instance: any): void;
export declare function __injectCmdEnd(target: any): void;
export declare function __unInjectCmdEnd(target: any): void;
export declare function __getModel(clazz: any): ModelBase;
export declare function CmdClass(cmdRoute: string): (clazz: any) => void;
export declare function CmdEnd(cmdRute: string): (instance: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function __execCmd(cmdRoute: string, ...args: any[]): Promise<void>;
export declare function __onCommandEnd(cmdRoute: string, caller: any, method: Function): void;
export declare function __offCommandEnd(cmdRoute: string, caller: any, method: Function): void;
