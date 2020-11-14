module vitamin {

    let __wachmap__: { [key: string]: { object: any, property: string } } = {};
    let __watchBinds: any = {};
    /**
     * 定义观察对象
     * @param object 观察对象
     * @param key 方便后续用于watchbind绑定的对象关键字.如果不指定,则默认取object.__watchkey__
     */
    export function watchdefine(object: any, key?: string) {
        if (!key) key = object.__watchkey__;
        __wachmap__[key] = object
    }


    /**
     * 观察对象属性变化【装饰器 装饰当前函数】
     * @param watchkey 观察对象定义好的关键字
     * @param watchproperty 观察对象的属性名称
     */
    export function watchbind(watchkey: string, watchproperty: string) {
        return function (target: any, property: string, descriptor: PropertyDescriptor) {
            //console.log("desc " + JSON.stringify(descriptor));
            // var className = __getClassName(target);
            //这里的 target 指向不是当前实例 也不是当前类 有待确认
            var func: Function = target[property];
            if (!(func instanceof Function)) return;
            __watchBinds[watchkey] = { property: watchproperty, method: func, caller: target };
        }
    }

    export function __initializeBinds() {
        for (var key in __watchBinds) {
            var info = __watchBinds[key];
            var watchobject = __wachmap__[key];
            if (watchobject) {
                Watch.property(watchobject, info.property, info.method, info.caller);
            }
        }
        __watchBinds = null;
    }

    export class Watch {

        public static object(object: any, method: Function, caller: any = null) {
            var propertys = Object.keys(object);
            for (var property of propertys) {
                if (object[property] instanceof Function) continue;
                Watch.property(object, property, method.bind(caller, property), caller);
            }
        }

        /**
         * 对属性进行观察并回调
         * @param object 需要观察的对象
         * @param property 需要观察的属性
         * @param method 回调
         * @param caller 回调作用域
         */
        public static property(objectKey: any | string, property: string, method: Function, caller: any = null) {
            var object = typeof objectKey == 'string' ? __wachmap__[objectKey] : objectKey;
            if (!object) return;
            if (!object.___watchconfig___) {
                Object.defineProperty(object, '___watchconfig___', {
                    value: {},
                    configurable: false,
                    enumerable: false
                });
            }
            var handlers: { caller: any, method: Function }[];
            if (object.___watchconfig___[property]) {
                handlers = object.___watchconfig___[property].handlers;
                for (var handler of handlers) {
                    if (handler.method == method && handler.caller == caller) {
                        return;
                    }
                }
                handlers.push({ caller: caller, method: method });
                return;
            }
            object.___watchconfig___[property] = { value: object[property], handlers: [{ caller: caller, method: method }] };
            Object.defineProperty(object, property, {
                configurable: false,
                enumerable: true,
                set: function (v: any) {
                    var propertyconfig = this.___watchconfig___[property];
                    propertyconfig.value = v;
                    for (var handler of propertyconfig.handlers) {
                        handler.method.call(handler.caller, v, this);
                    }
                },
                get: function () {
                    return this.___watchconfig___[property].value;
                }
            });
        }

        /**
         * 解除对象属性的观察
         * @param object 需要观察的对象
         * @param property 需要观察的属性
         * @param method 回调
         * @param caller 回调作用域
         */
        public static unproperty(object: any, property: string, method: Function, caller?: any) {
            if (object.___watchconfig___[property]) {
                var handlers = object.___watchconfig___[property].handlers;
                var index: number = 0;
                for (var handler of handlers) {
                    if (handler.method == method && handler.caller == caller) {
                        handlers.splice(index, 1);
                        break;
                    }
                    index++;
                }
            }
        }

        /**
         * 绑定当前对象的属性到目标对象属性
         * @param object 
         * @param property 
         * @param target 
         * @param targetproperty 
         */
        public static bind(object: any, property: string, target: any, targetproperty: string) {
            if (!target.___watchtriggerconfig___) {
                Object.defineProperty(target, '___watchtriggerconfig___', {
                    value: [],
                    configurable: false,
                    enumerable: false
                });
            }
            var method = (function (property, value) {
                this[property] = value;
            }).bind(target, targetproperty);
            target.___watchtriggerconfig___.push(method);
            Watch.property(object, property, method);
        }

        /**
         * 清除对象某个属性的全部观察回调
         * @param object 
         * @param property 
         */
        public static clearProperty(object: any, property: string) {
            if (object.___watchconfig___[property]) {
                var handlers = object.___watchconfig___[property].handlers;
                handlers.length = 0;
            }
        }

        /**
         * 清除该对象的所有观察回调
         * @param object 
         */
        public static clear(object: any) {
            for (var property in object.___watchconfig___) {
                if (object.___watchconfig___[property]) {
                    var handlers = object.___watchconfig___[property].handlers;
                    handlers.length = 0;
                }
            }
        }

        /**
         * 清除该对象的所有触发回调
         * @param object 
         */
        public static clearTrigger(object: any) {
            if (object.___watchtriggerconfig___) {
                var handlers = object.___watchtriggerconfig___;
                if (handlers) handlers.length = 0;
            }
        }
    }
}