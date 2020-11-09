import { EventDispatcher } from "three";

export abstract class LayerBase extends EventDispatcher {
    initialize(...args){}
    abstract render(time)
}