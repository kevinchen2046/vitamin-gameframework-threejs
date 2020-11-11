import { CommandBase, ModelBase, ViewBase } from "./Base";

export class SimpleDispatcher {
    private _map: { [key: string]: { caller: any, method: Function, priority: number }[] };
    constructor() {
        this._map = {};
    }
    public on(type: string, caller: any, listener: Function, priority: number = 0) {
        if (!this._map[type]) this._map[type] = [];
        this._map[type].push({ caller: caller, method: listener, priority: priority })
    }
    public off(type: string, caller: any, listener: Function) {
        var list = this._map[type];
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                var object = list[i];
                if (object.caller == caller && object.method == listener) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }
    public emit(type: string, ...args) {
        var list = this._map[type];
        if (list && list.length) {
            list.sort((a, b) => {
                return a.priority > b.priority ? 1 : -1;
            });
            for (var i = 0; i < list.length; i++) {
                var object = list[i];
                object.method.apply(object.caller, args);
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////
////                            Define
////////////////////////////////////////////////////////////////////////////////////

let __cmdRouteMap: { [key: string]: { name: string, route: string, instance: CommandBase, clazz: any } } = {};
let __cmdNameMap: { [key: string]: { name: string, route: string, instance: CommandBase, clazz: any } } = {};

let __modelMap: { [key: string]: { clazz: any, instance: ModelBase, dependents: any[] } } = {};
let __instanceMap: { [key: string]: any } = {};

let __injects: {
    instance: { [classname: string]: { property: string, instanceName: string }[] }
    model: { [classname: string]: { property: string, modelName: string }[] }
    cmdend: { [classname: string]: { route: string, methodkey: string }[] }
} = {
        instance: {},
        model: {},
        cmdend: {}
    };
let __commandcher: SimpleDispatcher = new SimpleDispatcher();


export function __getClassName(clazz: any) {
    // var type = typeof clazz;
    // if (!clazz || (type != "object" && !clazz.prototype)) {
    //     return type;
    // }
    var name: string = clazz.prototype ? clazz.prototype.constructor.name : Object.getPrototypeOf(clazz).constructor.name;
    // if (prototype.hasOwnProperty("__class__")) {
    //     return prototype["__class__"];
    // }
    // var constructorString = prototype.constructor.toString().trim();
    // var index = constructorString.indexOf("(");
    // var className = constructorString.substring(9, index);
    // Object.defineProperty(prototype, "__class__", {
    //     value: className,
    //     enumerable: false,
    //     writable: true
    // });
    if (name == 'Object') {
        name = clazz.constructor.name
    }
    // console.log('prototype.constructor.name', name);
    return name;
}

/**
 * 单例装饰器
 * @param clazz 需要单例化的class对象
 */
export function Instance(clazz: any) {
    return function (instance: any, property: string) {
        __instance(clazz);
        var className = __getClassName(instance as any);
        if (!__injects.instance[className]) __injects.instance[className] = [];
        __injects.instance[className].push({ property: property, instanceName: __getClassName(clazz) });
        // instance[property] = __instanceMap[clazzName];
    }
}

export function __instance(clazz: any) {
    var instanceName = __getClassName(clazz);
    if (!__instanceMap[instanceName]) {
        __instanceMap[instanceName] = new clazz();
    }
    return __instanceMap[instanceName];
}

////////////////////////////////////////////////////////////////////////////////////
////                            Model
////////////////////////////////////////////////////////////////////////////////////
/**
 * 数据模块的装饰器
 * @param dependents 当前数据模块的依赖模块
 */
export function ModelClass(...dependents) {
    return function (clazz: any) {
        var clazzName: string = __getClassName(clazz);
        __modelMap[clazzName] = { clazz: clazz, instance: new clazz(), dependents: dependents };
    }
}

/**
 * 数据模块实例的装饰器
 * @param instance 
 * @param property 
 */
export function Model(instance: any, property: string) {
    var name = `Model${property.charAt(0).toLocaleUpperCase()}${property.substring(1, property.length)}`;
    var clazzName = instance.constructor.name;
    if (!__injects.model[clazzName]) __injects.model[clazzName] = [];
    __injects.model[clazzName].push({ property: property, modelName: name });
    // __injects.push({ instance: instance, property: property, modelName: name });
}

function hasDependents(dependents) {
    for (var clazz of dependents) {
        var clazzName = __getClassName(clazz);
        if (!__modelMap[clazzName] || !__modelMap[clazzName].instance) {
            return false;
        }
    }
    return true;
}

export function __initializeModels() {
    var list = [];
    for (var clazzName in __modelMap) {
        list.push(__modelMap[clazzName]);
    }
    // __injectModel();
    var i: number = 0;
    while (list.length) {
        var modelInfo = list[i];
        if (hasDependents(modelInfo.dependents)) {
            __injectModel(modelInfo.instance);
            __injectInstance(modelInfo.instance);
            modelInfo.instance.initialize();
            modelInfo.dependents.length = 0;
            list.splice(i, 1);
            i--;
        }
        i++;
        if (i >= list.length) {
            i = 0;
        }
    }
}

export function __injectModel(instance: any) {
    var clazzName = instance.constructor.name;
    var list = __injects.model[clazzName];
    if (list && list.length) {
        for (var item of list) {
            instance[item.property] = __modelMap[item.modelName].instance;
        }
    }
}

export function __injectInstance(instance: any) {
    var clazzName = instance.constructor.name;
    var list = __injects.instance[clazzName];
    if (list && list.length) {
        for (var item of list) {
            instance[item.property] = __instanceMap[item.instanceName];
        }
    }
}

export function __injectCmdEnd(target: any) {
    var clazzName = __getClassName(target);
    var list = __injects.cmdend[clazzName];
    if (list && list.length) {
        for (var handler of list) {
            __onCommandEnd(handler.route, target, target[handler.methodkey]);
        }
    }
}

export function __unInjectCmdEnd(target: any) {
    var clazzName = __getClassName(target);
    var list = __injects.cmdend[clazzName];
    if (list && list.length) {
        for (var handler of list) {
            __offCommandEnd(handler.route, target, target[handler.methodkey]);
        }
    }
}
export function __getModel(clazz: any): ModelBase {
    var clazzName = __getClassName(clazz);
    if (__modelMap[clazzName]) return __modelMap[clazzName].instance;
    return null;
}

////////////////////////////////////////////////////////////////////////////////////
////                            Command
////////////////////////////////////////////////////////////////////////////////////
export function CmdClass(cmdRoute: string) {
    return function (clazz: any) {
        var className = __getClassName(clazz);
        __cmdRouteMap[cmdRoute] = __cmdNameMap[className] = { name: className, route: cmdRoute, instance: null, clazz: clazz };
    }
}

export function CmdEnd(cmdRute: string) {
    return function (instance: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (instance instanceof ViewBase) {
            var clazzName = (instance as any).constructor.name;
            // if (!__cmdEndMap[clazzName]) __cmdEndMap[clazzName] = [];
            if (instance[propertyKey] instanceof Function) {
                // __cmdEndMap[clazzName].push({ route: cmdRute, methodkey: propertyKey });
                if (!__injects.cmdend[clazzName]) __injects.cmdend[clazzName] = [];
                __injects.cmdend[clazzName].push({ route: cmdRute, methodkey: propertyKey });
            }
        }
        // __onCommandEnd(cmdRute, instance, instance[propertyKey]);
    }
}

function __getComdRoute(target: any) {
    var className = __getClassName(target);
    return __cmdNameMap[className].route;
}

export async function __execCmd(cmdRoute: string, ...args) {
    if (__cmdRouteMap[cmdRoute]) {
        if (!__cmdRouteMap[cmdRoute].instance) {
            __cmdRouteMap[cmdRoute].instance = new (__cmdRouteMap[cmdRoute].clazz)();
        }
        var result = await __cmdRouteMap[cmdRoute].instance.exec(...args);
        var route = __getComdRoute(__cmdRouteMap[cmdRoute].instance);
        __commandcher.emit(route, result);
    }
}

export function __onCommandEnd(cmdRoute: string, caller: any, method: Function) {
    __commandcher.on(cmdRoute, caller, method);
}

export function __offCommandEnd(cmdRoute: string, caller: any, method: Function) {
    __commandcher.off(cmdRoute, caller, method);
}
