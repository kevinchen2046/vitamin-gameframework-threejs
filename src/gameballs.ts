
import * as THREE from "three";
import { LayerBase } from "./base";

export class GameBalls extends LayerBase {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera
    private scene: THREE.Scene
    private sphereShadowBases: { base: THREE.Object3D, sphereMesh: THREE.Mesh, shadowMesh: THREE.Mesh, y: number }[];
    constructor(renderer: THREE.WebGLRenderer) {
        super();
        this.renderer = renderer;

        this.renderer.physicallyCorrectLights = true;

        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('white');

        const color = 0xFFFFFF;
        this.scene.fog = new THREE.Fog(color, near, far / 2);
        this.scene.background = new THREE.Color(color);

        const loader = new THREE.TextureLoader();

        const planeSize = 40;

        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        planeMat.color.setRGB(1.5, 1.5, 1.5);
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        this.scene.add(mesh);


        const shadowTexture = loader.load('https://threejsfundamentals.org/threejs/resources/images/roundshadow.png');
        this.sphereShadowBases = [];

        const sphereRadius = 1;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);


        const shadowGeo = new THREE.PlaneBufferGeometry(1, 1);

        const numSpheres = 15;
        for (let i = 0; i < numSpheres; ++i) {
            // make a base for the shadow and the sphere.
            // so they move together.
            const base = new THREE.Object3D();
            this.scene.add(base);

            // add the shadow to the base
            // note: we make a new material for each sphere
            // so we can set that sphere's material transparency
            // separately.
            const shadowMat = new THREE.MeshBasicMaterial({
                map: shadowTexture,
                transparent: true,    // so we can see the ground
                depthWrite: false,    // so we don't have to sort
            });
            const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
            shadowMesh.position.y = 0.001;  // so we're above the ground slightly
            shadowMesh.rotation.x = Math.PI * -.5;
            const shadowSize = sphereRadius * 4;
            shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
            base.add(shadowMesh);

            // add the sphere to the base
            const u = i / numSpheres;
            const sphereMat = new THREE.MeshPhongMaterial();
            sphereMat.color.setHSL(u, 1, .75);
            const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
            sphereMesh.position.set(0, sphereRadius + 2, 0);
            base.add(sphereMesh);

            // remember all 3 plus the y position
            this.sphereShadowBases.push({ base, sphereMesh, shadowMesh, y: sphereMesh.position.y });
        }


        {
            const skyColor = 0xB1E1FF;  // light blue
            const groundColor = 0xB97A20;  // brownish orange
            const intensity = 2;
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
            this.scene.add(light);
        }

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(0, 10, 5);
            light.target.position.set(-5, 0, 0);
            this.scene.add(light);
            this.scene.add(light.target);
        }

        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }

    private resize() {
        // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
        this.camera.aspect = window.innerWidth / window.innerHeight;

        this.camera.zoom = Math.min(1, window.innerWidth / 640);
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        this.camera.updateProjectionMatrix();
    }

    public render(time) {
        this.renderer.clear();
        this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        time *= 0.001;  // convert to seconds

        this.sphereShadowBases.forEach((sphereShadowBase, ndx) => {
            const { base, sphereMesh, shadowMesh, y } = sphereShadowBase;

            // u is a value that goes from 0 to 1 as we iterate the spheres
            const u = ndx / this.sphereShadowBases.length;

            // compute a position for there base. This will move
            // both the sphere and its shadow
            const speed = time * .2;
            const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
            const radius = Math.sin(speed - ndx) * 10;
            base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

            // yOff is a value that goes from 0 to 1
            const yOff = Math.abs(Math.sin(time * 2 + ndx));
            // move the sphere up and down
            sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
            // fade the shadow as the sphere goes up
            (shadowMesh.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(1, .25, yOff);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

