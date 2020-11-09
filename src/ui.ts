import * as THREE from "three";
import * as fgui from "../libs/fairygui/FairyGUI";
import { LayerBase } from "./base";

export class UIView extends LayerBase {
    private scene: THREE.Scene
    private renderer: THREE.WebGLRenderer;

    private mainMenu: fgui.GComponent;
    constructor(renderer: THREE.WebGLRenderer) {
        super();
        this.renderer = renderer;

        this.scene = new THREE.Scene();
        // this.scene.background=new THREE.Color();
        fgui.Stage.init(this.renderer);
        fgui.Stage.scene = this.scene;

        fgui.UIContentScaler.scaleWithScreenSize(640, 1136, fgui.ScreenMatchMode.MatchWidthOrHeight);
        // let listener: THREE.AudioListener = new THREE.AudioListener();
        // fgui.Stage.camera.add(listener);
        // fgui.Stage.audioListener = listener;
        fgui.UIPackage.loadPackage("assets/UI/Package1").then(this.start.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
    }

    private start() {
        this.mainMenu = fgui.UIPackage.createObject("Package1", "Main").asCom;
        this.mainMenu.makeFullScreen();
        fgui.GRoot.inst.addChild(this.mainMenu);
        this.resize();
    }

    public initialize(data: { desc: string }) {
        if(!this.mainMenu) return;
        var infolab:fgui.GLabel=this.mainMenu.getChild('info') as fgui.GLabel;
        infolab.text = data.desc;
        // infolab.width=infolab['_textField'].textWidth;
    }

    private resize() {
        if (!this.mainMenu) return;
        this.mainMenu.width = fgui.GRoot.inst.width;
        this.mainMenu.height = fgui.GRoot.inst.height;
    }

    public render(time) {
        this.renderer.clearDepth();
        fgui.Stage.update();
        this.renderer.render(this.scene, fgui.Stage.camera);
    }
}