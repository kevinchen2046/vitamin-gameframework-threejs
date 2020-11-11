import * as THREE from "three";
import { __execCmd, __getClassName, __initializeModels, __onCommandEnd } from "./base/Injecter";
import { GameBase } from "./manager/Fairy";
import { UIManager } from "./manager/UIManager";


export type VitaminOptions = {
    div?: HTMLDivElement | string,
    canvas?: HTMLCanvasElement | string,
    designWidth: number
    designHeight: number
}
/**
 * 框架上下文
 * 加入简单 View层管理、Command执行，集成Scene
 * 简单项目开箱即用
 */
export class Vitamin {
    private _renderer: THREE.WebGLRenderer;
    private _gamemap: { [key: string]: GameBase };
    private _options: VitaminOptions;
    public ui: UIManager;
    public game: GameBase;
    public initialize(options: VitaminOptions) {
        this._options = options;
        const div = options.div ? (typeof options.div == "string" ? (document.getElementById(options.div)) : options.div) : document.createElement('div');
        const canvas: HTMLCanvasElement = options.canvas ? (typeof options.canvas == "string" ? (document.getElementById(options.canvas) as HTMLCanvasElement) : options.canvas) : (document.createElement('canvas') as HTMLCanvasElement);
        div.appendChild(canvas);
        this._renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });//{ antialias: true ,alpha: true }
        // renderer.setClearColor(0x222222);
        this._renderer.autoClear = false;
        this._renderer.sortObjects = false;
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.setClearAlpha(0);
        // renderer.localClippingEnabled = true;

        this.ui = new UIManager(this._renderer);
        this.ui.initialize();
        // this.game = new GameBalls(renderer);
        // this.game.addEventListener('data', (data: any) => {
        //     this.ui.initialize(data);
        // })

        this._gamemap = {};

        requestAnimationFrame(this.animate);

        __initializeModels();

        window.addEventListener('resize', () => {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            this.ui.resize(window.innerWidth, window.innerHeight);
            this.game && this.game.resize(window.innerWidth, window.innerHeight);
        });
    }

    private render(time) {
        this.game && this.game.render(time);
        this.ui.render(time);
    }

    private animate = (time?) => {
        requestAnimationFrame(this.animate);
        this.render(time);
    }

    /**
     * 执行Command
     * @param cmdRoute 
     * @param args 
     */
    public execCommand(cmdRoute: string, ...args) {
        __execCmd(cmdRoute, null, ...args);
    }

    /**
     * 监听Command执行结束
     * @param cmdRoute 
     * @param caller 
     * @param method 
     */
    public onCommandEnd(cmdRoute: string, caller: any, method: Function) {
        __onCommandEnd(cmdRoute, caller, method);
    }

    public enterGame<T extends GameBase>(GameClazz: { new(...args): T }, ...args): T {
        var clazzname = __getClassName(GameClazz);
        if (!this._gamemap[clazzname]) {
            this._gamemap[clazzname] = new GameClazz(this._renderer);
        }
        var curgame = this._gamemap[clazzname];

        if (this.game != curgame) {
            if (this.game) this.game.exit();
            this.game = curgame;
            if (this.game) this.game.enter(...args);
        }
        return this.game as T;
    }

    public get designWidth() { return this._options.designWidth; }
    public get designHeight() { return this._options.designHeight; }
}

export const vitamin: Vitamin = new Vitamin();