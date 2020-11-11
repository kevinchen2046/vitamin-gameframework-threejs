/**
 * 定义观察对象
 * @param object 观察对象
 * @param key 方便后续用于watchbind绑定的对象关键字.如果不指定,则默认取object.__watchkey__
 */
export declare function watchdefine(object: any, key?: string): void;
/**
 * 观察对象属性变化【装饰器 装饰当前函数】
 * @param watchkey 观察对象定义好的关键字
 * @param watchproperty 观察对象的属性名称
 */
export declare function watchbind(watchkey: string, watchproperty: string): (target: any, property: string, descriptor: PropertyDescriptor) => void;
export declare function __initializeBinds(): void;
export declare class Watch {
    static object(object: any, method: Function, caller?: any): void;
    /**
     * 对属性进行观察并回调
     * @param object 需要观察的对象
     * @param property 需要观察的属性
     * @param method 回调
     * @param caller 回调作用域
     */
    static property(objectKey: any | string, property: string, method: Function, caller?: any): void;
    /**
     * 解除对象属性的观察
     * @param object 需要观察的对象
     * @param property 需要观察的属性
     * @param method 回调
     * @param caller 回调作用域
     */
    static unproperty(object: any, property: string, method: Function, caller?: any): void;
    /**
     * 绑定当前对象的属性到目标对象属性
     * @param object
     * @param property
     * @param target
     * @param targetproperty
     */
    static bind(object: any, property: string, target: any, targetproperty: string): void;
    /**
     * 清除对象某个属性的全部观察回调
     * @param object
     * @param property
     */
    static clearProperty(object: any, property: string): void;
    /**
     * 清除该对象的所有观察回调
     * @param object
     */
    static clear(object: any): void;
    /**
     * 清除该对象的所有触发回调
     * @param object
     */
    static clearTrigger(object: any): void;
}
