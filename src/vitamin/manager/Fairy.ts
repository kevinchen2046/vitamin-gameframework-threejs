import { ViewBase } from "../base/Base";
import * as THREE from "three";
import * as fgui from "../../../libs/fairygui/FairyGUI";


export class RenderBase extends THREE.EventDispatcher {
    protected _renderer: THREE.WebGLRenderer;
    constructor(renderer: THREE.WebGLRenderer) {
        super();
        this._renderer = renderer;
    }
    initialize(...args) { }
    resize(width: number, height: number) { }
    render(time) { }
}

export class GameBase extends RenderBase {
    enter(...args) { }
    exit() { }
    render(time) {
        this._renderer.clear();
        this._renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    }
}

export class ViewFairy extends ViewBase {
    public skin: fgui.GComponent;
    constructor(pkgName: string, uiname: string) {
        super();
        this.skin = fgui.UIPackage.createObject(pkgName, uiname) as fgui.GComponent;
        for(var child of this.skin._children){
            this[child.name]=child;
        }
    }

    public resize(width: number, height: number) { }
}