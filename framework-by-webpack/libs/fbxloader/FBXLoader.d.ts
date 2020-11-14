import { Object3D, Loader } from "three";

export class FBXLoader extends Loader {
    public load(url: string, complete: (object: Object3D) => void);
}