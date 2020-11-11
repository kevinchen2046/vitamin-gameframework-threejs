import * as THREE from "three";
import * as fgui from "../../../libs/fairygui/FairyGUI";
import { ViewBase } from "../base/Base";
import { __getClassName } from "../base/Injecter";
import { vitamin } from "../vitamin";

import { RenderBase, ViewFairy } from "./Fairy";

export class UIManager extends RenderBase {

    private _fixlayer: fgui.GComponent;
    private _dialoglayer: fgui.GComponent;
    private _alertlayer: fgui.GComponent;

    private _openlist: { name: string, view: ViewFairy }[];
    private _viewmap: { [key: string]: { pkname: string, uiname: string, clazz: any, view: ViewFairy } };
    private _scene: THREE.Scene
    private _defaultpkname: string;
    constructor(renderer: THREE.WebGLRenderer) {
        super(renderer);
        this._scene = new THREE.Scene();
        // this.scene.background=new THREE.Color();
        fgui.Stage.init(this._renderer);
        fgui.Stage.scene = this._scene;

        fgui.UIContentScaler.scaleWithScreenSize(vitamin.designWidth, vitamin.designHeight, fgui.ScreenMatchMode.MatchWidthOrHeight);
        // let listener: THREE.AudioListener = new THREE.AudioListener();
        // fgui.Stage.camera.add(listener);
        // fgui.Stage.audioListener = listener;
    }

    public initialize() {
        this._fixlayer = new fgui.GComponent();
        fgui.GRoot.inst.addChild(this._fixlayer);
        this._dialoglayer = new fgui.GComponent();
        fgui.GRoot.inst.addChild(this._dialoglayer);
        this._alertlayer = new fgui.GComponent();
        fgui.GRoot.inst.addChild(this._alertlayer);
        this._openlist = [];
        this._viewmap = {};
    }

    public render(time) {
        this._renderer.clearDepth();
        fgui.Stage.update();
        this._renderer.render(this._scene, fgui.Stage.camera);
    }

    public resize(width: number, height: number) {
        for (var view of this._openlist) {
            view.view.resize(fgui.GRoot.inst.width, fgui.GRoot.inst.height);
        }
    }

    public async load(packname: string) {
        this._defaultpkname = packname.lastIndexOf('/') > 0 ? packname.substring(packname.lastIndexOf('/') + 1, packname.length) : packname;
        await fgui.UIPackage.loadPackage(packname);
    }

    public register<T extends ViewFairy>(ViewClazz: { new(...args): T }, uiname: string, pkname: string = null) {
        var clazzName = __getClassName(ViewClazz);
        if (!this._viewmap[clazzName]) {
            this._viewmap[clazzName] = { pkname: pkname ? pkname : this._defaultpkname, uiname: uiname, clazz: ViewClazz, view: null }
        }
    }

    private __create<T extends ViewFairy>(ViewClazz: { new(...args): T }): T {
        var clazzName = __getClassName(ViewClazz);
        if (this._viewmap[clazzName]) {
            var info = this._viewmap[clazzName];
            if (!info.view) {
                info.view = new (info.clazz)(info.pkname, info.uiname);
            }
            return info.view as T;
        }
        return null;
    }

    /** 
     * 打开界面
     *  @param viewClazz 界面Class
     *  @param args 可变传参
    */
    public open<T extends ViewFairy>(ViewClazz: { new(...args): T }, ...args) {
        var clazzName = __getClassName(ViewClazz);
        if (this.has(clazzName)) {
            return;
        }
        var view: ViewFairy = this.__create(ViewClazz);
        if (!view) return null;
        this._openlist.push({ name: clazzName, view: view });
        this._fixlayer.addChild(view.skin);
        view.enter(...args);
        return view;
    }

    /**
     * 关闭界面
     * @param viewClazz 
     */
    public close<T extends ViewFairy>(ViewClazz: { new(...args): T }) {
        var index = this.__getViewIndex(ViewClazz);
        if (index >= 0) {
            var item = this._openlist.splice(index, 1)[0];
            item.view.exit();
            if (item.view.skin.parent) {
                item.view.skin.parent.removeChild(item.view.skin);
            }
        }
    }

    /**
     * 界面是否处于打开状态
     */
    public has<T extends ViewFairy>(ViewClazz: { new(...args): T } | string) {
        return this.__getViewIndex(ViewClazz) != -1;
    }

    private __getViewIndex<T extends ViewFairy>(ViewClazz: { new(...args): T } | string) {
        var clazzName = (typeof ViewClazz == 'string') ? ViewClazz : __getClassName(ViewClazz);
        var index: number = 0;
        for (var item of this._openlist) {
            if (item.name == clazzName) {
                return index;
            }
            index++;
        }
        return -1;
    }

}
