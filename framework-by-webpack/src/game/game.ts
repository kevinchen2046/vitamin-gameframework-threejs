import * as THREE from "three";
import { GameBase } from "../vitamin/manager/Fairy";

export class GameView extends GameBase {
    private camera: THREE.PerspectiveCamera
    private scene: THREE.Scene
    private cube: THREE.Mesh
    constructor(renderer: THREE.WebGLRenderer) {
        super(renderer);
        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.z = 2;

        this.scene = new THREE.Scene();
        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            this.scene.add(light);
        }

        const boxWidth = 1;
        const boxHeight = 1;
        const boxDepth = 1;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });  // greenish blue

        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        var loader = new THREE.ObjectLoader();
        //创建obj模型加载器对象
        loader.load("assets/UI/source/succulents.obj", this.start.bind(this));
        //加载obj完成后执行函数stl() 
        //stl加载完成后等待执行的函数 
        this.resize(window.innerWidth, window.innerHeight);
    }

    private start(object3D: THREE.Object3D) {
        object3D.scale.set(100, 100, 100);
        // //放大object3D对象 
        // var material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        // //材质对象
        // object3D.children.forEach(function (child: THREE.Object3D) {
        //     child.material = material;
        //     //object3D对象的子对象网格模型赋予材质对象 
        // });
        this.scene.add(object3D);//网格模型添加到场景中 
    }

    public resize(width: number, height: number) {
        // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
        this.camera.aspect = width / height;

        this.camera.zoom = Math.min(1, width / 640);
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        this.camera.updateProjectionMatrix();
    }

    public render(time) {
        this._renderer.clear();
        this._renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        time *= 0.001;  // convert time to seconds
        this.cube.rotation.x = time;
        this.cube.rotation.y = time;
        this._renderer.render(this.scene, this.camera);
    }
}

