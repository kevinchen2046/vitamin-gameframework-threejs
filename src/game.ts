import * as THREE from "three";

export class GameView {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera
    private scene: THREE.Scene
    private cube: THREE.Mesh
    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;

        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 5;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.z = 2;
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
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
    }

    private resize() {
        // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
        this.camera.aspect = window.innerWidth / window.innerHeight;
        
        this.camera.zoom=Math.min(1, window.innerWidth / 640);
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        this.camera.updateProjectionMatrix();
    }

    public render(time) {
        this.renderer.clear();
        this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        time *= 0.001;  // convert time to seconds
        this.cube.rotation.x = time;
        this.cube.rotation.y = time;
        this.renderer.render(this.scene, this.camera);
    }
}

