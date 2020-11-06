import * as THREE from "three";
import { GameView } from "./game";
import { UIView } from "./ui";

export class Main {
    private ui: UIView;
    private game: GameView;
    constructor() {
        this.init();
    }

    private init() {
        const canvas = document.createElement('canvas');
        document.getElementById('app').appendChild(canvas);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });//{ antialias: true ,alpha: true }
        // renderer.setClearColor(0x222222);
        renderer.autoClear = false;
        renderer.sortObjects = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // renderer.setClearAlpha(0);
        // renderer.localClippingEnabled = true;
        window.addEventListener('resize', () => renderer.setSize(window.innerWidth, window.innerHeight));
        this.ui = new UIView(renderer);
        this.game = new GameView(renderer);
        requestAnimationFrame(this.animate);
    }

    private render(time) {
        this.game.render(time);
        this.ui.render(time);
    }

    private animate = (time?) => {
        requestAnimationFrame(this.animate);
        this.render(time);
    }
}

new Main();