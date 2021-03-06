import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
import { GRoot } from "./GRoot";
export interface IUISource {
    fileName: string;
    loaded: boolean;
    load(callback: Function, target: any): void;
}
export declare class Window extends GComponent {
    bringToFontOnClick: boolean;
    private _contentPane;
    private _modalWaitPane;
    private _closeButton;
    private _dragArea;
    private _contentArea;
    private _frame;
    private _modal;
    private _uiSources;
    private _inited;
    private _loading;
    protected _requestingCmd: number;
    constructor();
    addUISource(source: IUISource): void;
    set contentPane(val: GComponent);
    get contentPane(): GComponent;
    get frame(): GComponent;
    get closeButton(): GObject;
    set closeButton(value: GObject);
    get dragArea(): GObject;
    set dragArea(value: GObject);
    get contentArea(): GObject;
    set contentArea(value: GObject);
    show(): void;
    showOn(root: GRoot): void;
    hide(): void;
    hideImmediately(): void;
    centerOn(r: GRoot, restraint?: boolean): void;
    toggleStatus(): void;
    get isShowing(): boolean;
    get isTop(): boolean;
    get modal(): boolean;
    set modal(val: boolean);
    bringToFront(): void;
    showModalWait(requestingCmd?: number): void;
    protected layoutModalWaitPane(): void;
    closeModalWait(requestingCmd?: number): boolean;
    get modalWaiting(): boolean;
    init(): void;
    protected onInit(): void;
    protected onShown(): void;
    protected onHide(): void;
    protected doShowAnimation(): void;
    protected doHideAnimation(): void;
    private __uiLoadComplete;
    private _init;
    dispose(): void;
    protected closeEventHandler(): void;
    private __onShown;
    private __onHidden;
    private __winTouchBegin;
    private __dragStart;
}
