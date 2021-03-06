import { MovieClip } from "../core/MovieClip";
import { NTexture } from "../core/NTexture";
import { ByteBuffer } from "../utils/ByteBuffer";
import { AlignType, VertAlignType } from "./FieldTypes";
import { GComponent } from "./GComponent";
import { GObject } from "./GObject";
export declare class GLoader extends GObject {
    private _url;
    private _align;
    private _valign;
    private _autoSize;
    private _fill;
    private _shrinkOnly;
    private _contentItem;
    private _content;
    private _content2?;
    private _updatingLayout;
    constructor();
    protected createDisplayObject(): void;
    dispose(): void;
    get url(): string;
    set url(value: string);
    get icon(): string;
    set icon(value: string);
    get align(): AlignType;
    set align(value: AlignType);
    get verticalAlign(): VertAlignType;
    set verticalAlign(value: VertAlignType);
    get fill(): number;
    set fill(value: number);
    get shrinkOnly(): boolean;
    set shrinkOnly(value: boolean);
    get autoSize(): boolean;
    set autoSize(value: boolean);
    get playing(): boolean;
    set playing(value: boolean);
    get frame(): number;
    set frame(value: number);
    get color(): number;
    set color(value: number);
    get fillMethod(): number;
    set fillMethod(value: number);
    get fillOrigin(): number;
    set fillOrigin(value: number);
    get fillClockwise(): boolean;
    set fillClockwise(value: boolean);
    get fillAmount(): number;
    set fillAmount(value: number);
    get content(): MovieClip;
    get component(): GComponent;
    protected loadContent(): void;
    protected loadFromPackage(itemURL: string): void;
    protected loadExternal(): void;
    protected freeExternal(texture: NTexture): void;
    protected onExternalLoadSuccess(texture: NTexture): void;
    protected onExternalLoadFailed(): void;
    private setErrorState;
    private clearErrorState;
    private updateLayout;
    private clearContent;
    protected handleSizeChanged(): void;
    getProp(index: number): any;
    setProp(index: number, value: any): void;
    setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
}
