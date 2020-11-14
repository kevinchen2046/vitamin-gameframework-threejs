declare namespace THREE {
    class FBXLoader extends Loader {
        public load(url: string, complete: (object: Object3D) => void);
    }
}