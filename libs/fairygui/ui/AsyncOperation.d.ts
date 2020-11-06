export declare class AsyncOperation {
    callback: (GObject: any) => void;
    private _itemList;
    private _objectPool;
    private _index;
    constructor();
    createObject(pkgName: string, resName: string): void;
    createObjectFromURL(url: string): void;
    cancel(): void;
    private internalCreateObject;
    private collectComponentChildren;
    private collectListChildren;
    private run;
}
