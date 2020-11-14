import * as THREE from "three";

import { GameBase } from "../vitamin/manager/Fairy";

export class GameTank extends GameBase {

    private scene: THREE.Scene

    private cameras: { cam: THREE.PerspectiveCamera, desc: string }[];

    private mainCamera: THREE.PerspectiveCamera
    private tankCamera: THREE.PerspectiveCamera;
    private turretCamera: THREE.PerspectiveCamera
    private targetCamera: THREE.PerspectiveCamera

    private targetGeometry: THREE.SphereBufferGeometry;
    private targetMaterial: THREE.MeshPhongMaterial;
    private targetMesh: THREE.Mesh;
    private targetOrbit: THREE.Object3D;
    private targetElevation: THREE.Object3D;
    private targetBob: THREE.Object3D;

    private curve: THREE.SplineCurve
    private tank: THREE.Object3D

    private wheelMeshes: THREE.Mesh[];
    private turretPivot: THREE.Object3D;

    private targetCameraPivot: THREE.Object3D

    private targetPosition: THREE.Vector3;
    private tankPosition: THREE.Vector2;
    private tankTarget: THREE.Vector2;
    constructor(renderer: THREE.WebGLRenderer) {
        super(renderer);
    
        renderer.setClearColor(0xAAAAAA);
        renderer.shadowMap.enabled = true;

        this.scene = new THREE.Scene();

        //主摄像机
        const fov = 40;
        const aspect = 2;  // the canvas default
        const zNear = 0.1;
        const zFar = 1000;
        this.mainCamera = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
        this.mainCamera.position.set(8, 4, 10).multiplyScalar(3);
        this.mainCamera.lookAt(0, 0, 0);

        //打光
        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 20, 0);
            this.scene.add(light);
            light.castShadow = true;
            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 2048;

            const d = 50;
            light.shadow.camera.left = -d;
            light.shadow.camera.right = d;
            light.shadow.camera.top = d;
            light.shadow.camera.bottom = -d;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 50;
            light.shadow.bias = 0.001;
        }

        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 2, 4);
            this.scene.add(light);
        }

        //地面
        const groundGeometry = new THREE.PlaneBufferGeometry(100, 100);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = Math.PI * -.5;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);


        //坦克
        const carWidth = 4;
        const carHeight = 1;
        const carLength = 8;

        this.tank = new THREE.Object3D();
        this.scene.add(this.tank);

        //坦克身体
        const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA });
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.y = 1.4;
        bodyMesh.castShadow = true;
        this.tank.add(bodyMesh);

        //坦克摄像机
        const tankCameraFov = 75;
        const tankAspect = 2;  // the canvas default
        const tankZNear = 0.1;
        const tankZFar = 1000;
        this.tankCamera = new THREE.PerspectiveCamera(tankCameraFov, tankAspect, tankZNear, tankZFar);
        this.tankCamera.position.y = 3;
        this.tankCamera.position.z = -6;
        this.tankCamera.rotation.y = Math.PI;
        bodyMesh.add(this.tankCamera);

        //坦克四个轮子
        const wheelRadius = 1;
        const wheelThickness = .5;
        const wheelSegments = 12;
        const wheelGeometry = new THREE.CylinderBufferGeometry(
            wheelRadius,     // top radius
            wheelRadius,     // bottom radius
            wheelThickness,  // height of cylinder
            wheelSegments);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const wheelPositions = [
            [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
            [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
            [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
            [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
            [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
            [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
        ];
        this.wheelMeshes = wheelPositions.map((position: number[]) => {
            const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
            mesh.position.set(position[0], position[1], position[2]);
            mesh.rotation.z = Math.PI * .5;
            mesh.castShadow = true;
            bodyMesh.add(mesh);
            return mesh;
        });

        //坦克的顶盖
        const domeRadius = 2;
        const domeWidthSubdivisions = 12;
        const domeHeightSubdivisions = 12;
        const domePhiStart = 0;
        const domePhiEnd = Math.PI * 2;
        const domeThetaStart = 0;
        const domeThetaEnd = Math.PI * .5;
        const domeGeometry = new THREE.SphereBufferGeometry(
            domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
            domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
        const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
        domeMesh.castShadow = true;
        bodyMesh.add(domeMesh);
        domeMesh.position.y = .5;

        //坦克的炮管
        const turretWidth = .1;
        const turretHeight = .1;
        const turretLength = carLength * .75 * .2;
        const turretGeometry = new THREE.BoxBufferGeometry(
            turretWidth, turretHeight, turretLength);
        const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
        this.turretPivot = new THREE.Object3D();
        turretMesh.castShadow = true;
        this.turretPivot.scale.set(5, 5, 5);
        this.turretPivot.position.y = .5;
        turretMesh.position.z = turretLength * .5;
        this.turretPivot.add(turretMesh);
        bodyMesh.add(this.turretPivot);

        //炮管绑定的摄像机
        const turretFov = 40;
        const turretAspect = 2;  // the canvas default
        const turretZNear = 0.1;
        const turretZFar = 1000;
        this.turretCamera = new THREE.PerspectiveCamera(turretFov, turretAspect, turretZNear, turretZFar);
        this.turretCamera.position.y = .75 * .2;
        turretMesh.add(this.turretCamera);

        //目标球    
        this.targetGeometry = new THREE.SphereBufferGeometry(.5, 6, 3);
        this.targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true });
        this.targetMesh = new THREE.Mesh(this.targetGeometry, this.targetMaterial);
        this.targetOrbit = new THREE.Object3D();
        this.targetElevation = new THREE.Object3D();
        this.targetBob = new THREE.Object3D();
        this.targetMesh.castShadow = true;
        this.scene.add(this.targetOrbit);
        this.targetOrbit.add(this.targetElevation);
        this.targetElevation.position.z = carLength * 2;
        this.targetElevation.position.y = 8;
        this.targetElevation.add(this.targetBob);
        this.targetBob.add(this.targetMesh);

        //目标摄像机      
        const targetFov = 40;
        const targetAspect = 2;  // the canvas default
        const targetZNear = 0.1;
        const targetZFar = 1000;
        this.targetCamera = new THREE.PerspectiveCamera(targetFov, targetAspect, targetZNear, targetZFar);
        this.targetCameraPivot = new THREE.Object3D();
        this.targetCamera.position.y = 1;
        this.targetCamera.position.z = -2;
        this.targetCamera.rotation.y = Math.PI;
        this.targetBob.add(this.targetCameraPivot);
        this.targetCameraPivot.add(this.targetCamera);

        // Create a sine-like wave
        //坦克行进路线
        this.curve = new THREE.SplineCurve([
            new THREE.Vector2(-10, 0),
            new THREE.Vector2(-5, 5),
            new THREE.Vector2(0, 0),
            new THREE.Vector2(5, -5),
            new THREE.Vector2(10, 0),
            new THREE.Vector2(5, 10),
            new THREE.Vector2(-5, 10),
            new THREE.Vector2(-10, -10),
            new THREE.Vector2(-15, -8),
            new THREE.Vector2(-10, 0),
        ]);

        const points = this.curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const splineObject = new THREE.Line(geometry, material);
        splineObject.rotation.x = Math.PI * .5;
        splineObject.position.y = 0.05;
        this.scene.add(splineObject);

        this.targetPosition = new THREE.Vector3();
        this.tankPosition = new THREE.Vector2();
        this.tankTarget = new THREE.Vector2();

        this.cameras = [
            { cam: this.mainCamera, desc: 'detached camera', },
            { cam: this.turretCamera, desc: 'on turret looking at target', },
            { cam: this.targetCamera, desc: 'near target looking at tank', },
            { cam: this.tankCamera, desc: 'above back of tank', },
        ];
        window.addEventListener('resize', this.resize.bind(this));
        this.resize(window.innerWidth, window.innerHeight);
    }

    public resize(width: number, height: number) {
        this.cameras.forEach((cameraInfo) => {
            const camera = cameraInfo.cam;
            camera.aspect = width / height;
            camera.zoom = Math.min(1, width / 640);
            camera.updateProjectionMatrix();
        });
    }

    public render(time) {
        super.render(time);
        time *= 0.001;

        // 目标移动
        this.targetOrbit.rotation.y = time * .27;
        this.targetBob.position.y = Math.sin(time * 2) * 4;
        this.targetMesh.rotation.x = time * 7;
        this.targetMesh.rotation.y = time * 13;
        this.targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25);
        this.targetMaterial.color.setHSL(time * 10 % 1, 1, .25);

        // 坦克移动
        const tankTime = time * .05;
        this.curve.getPointAt(tankTime % 1, this.tankPosition);
        this.curve.getPointAt((tankTime + 0.01) % 1, this.tankTarget);
        this.tank.position.set(this.tankPosition.x, 0, this.tankPosition.y);
        this.tank.lookAt(this.tankTarget.x, 0, this.tankTarget.y);

        // 坦克的炮管跟踪小球
        this.targetMesh.getWorldPosition(this.targetPosition);
        this.turretPivot.lookAt(this.targetPosition);

        // 炮管的摄像机面对目标小球
        this.turretCamera.lookAt(this.targetPosition);

        // 让目标摄影机快速瞄准坦克
        this.tank.getWorldPosition(this.targetPosition);
        this.targetCameraPivot.lookAt(this.targetPosition);

        //转动车轮
        this.wheelMeshes.forEach((obj) => {
            obj.rotation.x = time * 3;
        });

        //切换摄像机
        const camera = this.cameras[time * .25 % this.cameras.length | 0];
        this.dispatchEvent({ type: 'data', desc: camera.desc });

        this._renderer.render(this.scene, camera.cam);
    }
}