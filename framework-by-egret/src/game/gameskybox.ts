class GameSkyBox extends vitamin.GameBase {

    private camera: THREE.PerspectiveCamera
    private scene: THREE.Scene
    private cubes: THREE.Mesh[];
    private spheres: THREE.Mesh[];
    constructor(renderer: THREE.WebGLRenderer) {
        super(renderer);

        const fov = 75;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.z = 3;

        const controls = new OrbitControls(this.camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

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

        function makeInstance(geometry, color, x) {
            const material = new THREE.MeshPhongMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            cube.position.x = x;
            return cube;
        }

        this.cubes = [
            makeInstance.bind(this)(geometry, 0x44aa88, 0),
            makeInstance.bind(this)(geometry, 0x8844aa, -2),
            makeInstance.bind(this)(geometry, 0xaa8844, 2),
        ];

        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg', () => {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(renderer, texture);
            this.scene.background = rt;
            {
                this.spheres = [];
                const geometry = new THREE.SphereBufferGeometry(0.1, 32, 16);
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: texture });
                for (let i = 0; i < 500; i++) {
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = Math.random() * 10 - 5;
                    mesh.position.y = Math.random() * 10 - 5;
                    mesh.position.z = Math.random() * 10 - 5;
                    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() + 1;
                    this.scene.add(mesh);
                    this.spheres.push(mesh);
                }
            }
        });
        window.addEventListener('resize', this.resize.bind(this));
        this.resize(window.innerWidth, window.innerHeight);
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
        super.render(time);
        time *= 0.001;

        this.cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });
        for (let i = 0, il = this.spheres.length; i < il; i++) {
            const sphere = this.spheres[i];
            sphere.position.x = Math.cos(time + i);
            sphere.position.y = Math.sin(time + i * 1.1);
        }
        this._renderer.render(this.scene, this.camera);
    }
}