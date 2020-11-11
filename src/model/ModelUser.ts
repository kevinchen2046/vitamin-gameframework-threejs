import { ModelBase } from "../vitamin/base/Base";
import { Model, ModelClass } from "../vitamin/base/Injecter";

//当前装饰器需要传入其依赖的模块
@ModelClass()
export class ModelUser extends ModelBase {

    public name: string;

    public initialize() {
        
    }
}