import { Object3D } from "three";
import { FlipType } from "../ui/FieldTypes";
import { Rect } from "../utils/Rect";
import { IMeshFactory } from "./mesh/MeshFactory";
import { VertexBuffer } from "./mesh/VertexBuffer";
import { NMaterial } from "./NMaterial";
import { NTexture } from "./NTexture";
export declare class NGraphics implements IMeshFactory {
    private _texture;
    private _geometry;
    private _material;
    private _meshFactory;
    private _color;
    private _meshDirty;
    private _contentRect;
    private _flip;
    constructor(owner: Object3D);
    get texture(): NTexture;
    set texture(value: NTexture);
    get material(): NMaterial;
    set material(value: NMaterial);
    get meshFactory(): IMeshFactory;
    set meshFactory(value: IMeshFactory);
    getMeshFactory<T extends IMeshFactory>(type: new () => T): T;
    setDrawRect(rect: Rect): void;
    get flip(): FlipType;
    set flip(value: FlipType);
    get color(): number;
    set color(value: number);
    get grayed(): boolean;
    set grayed(value: boolean);
    setKeyword(key: string, value: Boolean): void;
    setMeshDirty(): void;
    updateMesh(): boolean;
    update(clipPlanes: any, alpha: number): void;
    updateMeshNow(): void;
    private writeAttribute;
    private writeIndexAttribute;
    onPopulateMesh(vb: VertexBuffer): void;
}
