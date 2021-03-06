import { AlignType, AutoSizeType, VertAlignType } from "../../ui/FieldTypes";
import { HtmlElement } from "../../utils/html/HtmlElement";
import { Rect } from "../../utils/Rect";
import { DisplayObject } from "../DisplayObject";
import { IMeshFactory } from "../mesh/MeshFactory";
import { VertexBuffer } from "../mesh/VertexBuffer";
import { BaseFont } from "./BaseFont";
import { TextFormat } from "./TextFormat";
export declare class TextField extends DisplayObject implements IMeshFactory {
    protected _verticalAlign: VertAlignType;
    protected _textFormat: TextFormat;
    protected _text: string;
    protected _autoSize: AutoSizeType;
    protected _wordWrap: boolean;
    protected _singleLine: boolean;
    protected _html: boolean;
    protected _maxWidth: number;
    protected _elements: Array<HtmlElement>;
    protected _lines: Array<LineInfo>;
    protected _charPositions: Array<CharPosition>;
    protected _font: BaseFont;
    protected _textWidth: number;
    protected _textHeight: number;
    protected _textChanged: boolean;
    protected _yOffset: number;
    protected _fontSizeScale: number;
    protected _fontVersion: number;
    protected _parsedText: string;
    protected _updatingSize?: boolean;
    protected isInput?: boolean;
    protected isRich?: boolean;
    constructor();
    get textFormat(): TextFormat;
    applyFormat(): void;
    get align(): AlignType;
    set align(value: AlignType);
    get verticalAlign(): VertAlignType;
    set verticalAlign(value: VertAlignType);
    get text(): string;
    set text(value: string);
    get htmlText(): string;
    set htmlText(value: string);
    get parsedText(): string;
    get autoSize(): AutoSizeType;
    set autoSize(value: AutoSizeType);
    get wordWrap(): boolean;
    set wordWrap(value: boolean);
    get singleLine(): boolean;
    set singleLine(value: boolean);
    get textWidth(): number;
    get textHeight(): number;
    get maxWidth(): number;
    set maxWidth(value: number);
    get htmlElements(): Array<HtmlElement>;
    get lines(): Array<LineInfo>;
    get charPositions(): Array<CharPosition>;
    redraw(): boolean;
    getLinesShape(startLine: number, startCharX: number, endLine: number, endCharX: number, clipped: boolean, result: Array<Rect>): void;
    protected onSizeChanged(): void;
    ensureSizeCorrect(): void;
    update(clippingPlanes: any, alpha: number): void;
    private requestText;
    private buildLines;
    private parseText;
    private buildLines2;
    private updateLineInfo;
    private doShrink;
    onPopulateMesh(vb: VertexBuffer): void;
    private cleanup;
    private applyVertAlign;
    protected refreshObjects(): void;
    protected cleanupObjects(): void;
}
export declare const GUTTER_X: number;
export declare const GUTTER_Y: number;
export declare class LineInfo {
    width: number;
    height: number;
    baseline: number;
    charIndex: number;
    charCount: number;
    y: number;
    y2: number;
}
export declare class CharPosition {
    charIndex: number;
    lineIndex: number;
    offsetX: number;
    vertCount: number;
    width: number;
    imgIndex: number;
}
