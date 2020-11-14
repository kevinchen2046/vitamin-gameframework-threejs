declare namespace FairyGUI {
    export class ChangePageAction extends ControllerAction {
        objectId: string;
        controllerName: string;
        targetPage: string;
        constructor();
        protected enter(controller: Controller): void;
        setup(buffer: ByteBuffer): void;
    }

    export class ControllerAction {
        fromPage: Array<string>;
        toPage: Array<string>;
        constructor();
        run(controller: Controller, prevPage: string, curPage: string): void;
        protected enter(controller: Controller): void;
        protected leave(controller: Controller): void;
        setup(buffer: ByteBuffer): void;
    }

    export class PlayTransitionAction extends ControllerAction {
        transitionName: string;
        playTimes: number;
        delay: number;
        stopOnExit: boolean;
        private _currentTransition;
        constructor();
        protected enter(controller: Controller): void;
        protected leave(controller: Controller): void;
        setup(buffer: ByteBuffer): void;
    }

    export class DisplayObject extends EventDispatcher {
        opaque?: boolean;
        hitArea?: IHitTest;
        mask?: DisplayObject;
        reversedMask?: boolean;
        camera?: THREE.Camera;
        protected _contentRect: Rect;
        protected _alpha: number;
        protected _touchable: boolean;
        protected _touchDisabled?: boolean;
        protected _pos: THREE.Vector3;
        protected _rot: THREE.Euler;
        protected _pivot: THREE.Vector2;
        protected _pivotOffset: THREE.Vector3;
        protected _clipRect?: Rect;
        protected _clipPlanes?: Array<THREE.Plane>;
        protected _obj3D: THREE.Object3D;
        protected _graphics?: NGraphics;
        private _matrixDirty;
        constructor();
        readonly obj3D: THREE.Object3D;
        name: string;
        x: number;
        y: number;
        z: number;

        setPosition(x: number, y: number, z?: number, isPivot?: boolean): void;

        width: number;
        height: number;

        setSize(wv: number, hv: number): void;
        protected ensureSizeCorrect(): void;
        protected onSizeChanged(): void;

        pivotX: number;
        pivotY: number;

        setPivot(xv: number, yv: number): void;
        private updatePivotOffset;
        private applyPivot;

        scaleX: number;
        scaleY: number;
        setScale(xv: number, yv: number): void;

        rotationX: number;
        rotationY: number;

        rotation: number;
        alpha: number;
        readonly parent: THREE.Object3D;
        readonly stage: THREE.Scene;
        readonly graphics: NGraphics;
        touchable: boolean;
        visible: boolean;


        color: number;
        blendMode: THREE.Blending

        setLayer(layer: number): void;
        validateMatrix(): void;
        _getRenderCamera(): THREE.Camera;
        worldToLocal(pt: THREE.Vector3, direction?: THREE.Vector3, validate?: boolean): THREE.Vector3;
        localToWorld(pt: THREE.Vector3, validate?: boolean): THREE.Vector3;
        globalToLocal(x: number, y: number, result?: THREE.Vector2): THREE.Vector2;
        localToGlobal(x: number, y: number, result?: THREE.Vector2): THREE.Vector2;
        getBounds(targetSpace: THREE.Object3D, result?: Rect): Rect;
        transformPoint(x: number, y: number, targetSpace?: THREE.Object3D, result?: THREE.Vector2): THREE.Vector2;
        transformRect(rect: Rect, targetSpace?: THREE.Object3D, result?: Rect): Rect;
        private transformRectPoint;
        addChild(child: DisplayObject): void;
        addChildAt(child: DisplayObject, index: number): void;
        removeChild(child: DisplayObject): void;
        removeChildAt(index: number): void;
        setChildIndex(child: DisplayObject, index: number): void;
        getIndex(child: DisplayObject): number;
        readonly numChildren: number;
        clipRect: Rect;
        update(clipPlanes: any, alpha: number): void;
        protected hitTest(context: HitTestContext): DisplayObject;
        dispose(): void;
    }
    export function traverseUpdate(p: THREE.Object3D, clippingPlanes: any, alpha: number): void;
    export function traverseHitTest(p: THREE.Object3D, context: HitTestContext, mask?: any): DisplayObject;

    export interface IHitTest {
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    export class PixelHitTestData {
        pixelWidth: number;
        scale: number;
        pixels: Uint8Array;
        load(ba: ByteBuffer): void;
    }
    export class PixelHitTest implements IHitTest {
        offsetX: number;
        offsetY: number;
        sourceWidth: number;
        sourceHeight: number;
        private _data;
        constructor(data: PixelHitTestData, offsetX: number, offsetY: number, sourceWidth: number, sourceHeight: number);
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    export class ShapeHitTest implements IHitTest {
        shape: DisplayObject;
        constructor(obj: DisplayObject);
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    export class Image extends DisplayObject implements IMeshFactory {
        protected _scaleByTile: boolean;
        protected _scale9Grid: Rect;
        protected _textureScale: THREE.Vector2;
        protected _tileGridIndice: number;
        protected _fillMesh?: FillMesh;
        constructor();
        texture: NTexture;

        textureScale: THREE.Vector2;

        scale9Grid: Rect;

        scaleByTile: boolean;

        tileGridIndice: number;

        fillMethod: number;

        fillOrigin: number;

        fillClockwise: boolean;

        fillAmount: number;

        onPopulateMesh(vb: VertexBuffer): void;
        private sliceFill;
        private tileFill;
    }

    export class CompositeMesh implements IMeshFactory, IHitTest {
        readonly elements: Array<IMeshFactory>;
        activeIndex: number;
        constructor();
        onPopulateMesh(vb: VertexBuffer): void;
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    export class EllipseMesh implements IMeshFactory, IHitTest {
        drawRect: Rect;
        lineWidth: number;
        lineColor: Color4;
        centerColor: Color4;
        fillColor: Color4;
        startDegree: number;
        endDegreee: number;
        constructor();
        onPopulateMesh(vb: VertexBuffer): void;
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    export class FillMesh implements IMeshFactory {
        method: FillMethod;
        origin: number;
        amount: number;
        clockwise: boolean;
        constructor();
        onPopulateMesh(vb: VertexBuffer): void;
    }

    export interface IMeshFactory {
        onPopulateMesh(vb: VertexBuffer): void;
    }

    export class PolygonMesh implements IMeshFactory, IHitTest {
        readonly points: Array<number>;
        readonly texcoords: Array<number>;
        lineWidth: number;
        lineColor: Color4;
        fillColor: Color4;
        usePercentPositions: boolean;
        constructor();
        add(x: number, y: number, uv_x?: number, uv_y?: number): void;
        onPopulateMesh(vb: VertexBuffer): void;
        private drawOutline;
        private isPointInTriangle;
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    export class RectMesh implements IMeshFactory {
        drawRect: Rect;
        lineWidth: number;
        lineColor: Color4;
        fillColor: Color4;
        constructor();
        onPopulateMesh(vb: VertexBuffer): void;
    }

    export class RegularPolygonMesh implements IMeshFactory, IHitTest {
        drawRect: Rect;
        sides: number;
        lineWidth: number;
        lineColor: Color4;
        centerColor: Color4;
        fillColor: Color4;
        distances: Array<number>;
        rotation: number;
        constructor();
        onPopulateMesh(vb: VertexBuffer): void;
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    export class RoundedRectMesh implements IMeshFactory, IHitTest {
        drawRect: Rect;
        lineWidth: number;
        lineColor: Color4;
        fillColor: Color4;
        topLeftRadius: number;
        topRightRadius: number;
        bottomLeftRadius: number;
        bottomRightRadius: number;
        constructor();
        onPopulateMesh(vb: VertexBuffer): void;
        hitTest(contentRect: Rect, x: number, y: number): boolean;
    }

    /**
     * 1---2
     * | / |
     * 0---3
     * threejs anti-clockwise vertex order. ie 0-2-1， 0-3-2
     */
    export class VertexBuffer {
        contentRect: Rect;
        uvRect: Rect;
        vertexColor: Color4;
        textureSize: THREE.Vector2;
        readonly vertices: Array<number>;
        readonly uvs: Array<number>;
        readonly colors: Array<number>;
        readonly triangles: Array<number>;
        static begin(source?: VertexBuffer): VertexBuffer;
        constructor();
        end(): void;
        clear(): void;
        readonly currentVertCount: number;
        addVert(x: number, y: number, z: number, uv_x?: number | Color4, uv_y?: number, color?: Color4): void;
        addQuad(vertRect: Rect, uvRect?: Rect | Array<THREE.Vector2>, color?: Color4): void;
        repeatColors(value: Array<number>, startIndex: number, count: number): void;
        addTriangle(idx0: number, idx1: number, idx2: number): void;
        addTriangles(startVertexIndex?: number, idxList?: Array<number>): void;
        getPosition(index: number, ret: THREE.Vector3): THREE.Vector3;
        append(vb: VertexBuffer): void;
    }

    export interface Frame {
        addDelay?: number;
        texture: NTexture;
    }
    export class MovieClip extends Image {
        interval: number;
        swing: boolean;
        repeatDelay: number;
        timeScale: number;
        private _playing;
        private _frameCount;
        private _frames;
        private _frame;
        private _start;
        private _end;
        private _times;
        private _endAt;
        private _status;
        private _frameElapsed;
        private _reversed;
        private _repeatedCount;
        constructor();
        frames: Frame[];
        readonly frameCount: number;
        frame: number;
        playing: boolean;
        rewind(): void;
        syncStatus(anotherMc: MovieClip): void;
        advance(timeInMiniseconds: number): void;
        setPlaySettings(start?: number, end?: number, times?: number, endAt?: number): void;
        private onTimer;
        private drawFrame;
        private checkTimer;
        private __addToStage;
        private __removeFromStage;
    }

    export class NGraphics implements IMeshFactory {
        private _texture;
        private _geometry;
        private _material;
        private _meshFactory;
        private _color;
        private _meshDirty;
        private _contentRect;
        private _flip;
        constructor(owner: THREE.Object3D);
        texture: NTexture;

        material: NMaterial;

        meshFactory: IMeshFactory;

        getMeshFactory<T extends IMeshFactory>(type: new () => T): T;
        setDrawRect(rect: Rect): void;
        flip: FlipType;


        color: number;


        grayed: boolean;

        setKeyword(key: string, value: Boolean): void;
        setMeshDirty(): void;
        updateMesh(): boolean;
        update(clipPlanes: any, alpha: number): void;
        updateMeshNow(): void;
        private writeAttribute;
        private writeIndexAttribute;
        onPopulateMesh(vb: VertexBuffer): void;
    }

    export class NMaterial extends THREE.ShaderMaterial {
        map: THREE.Texture;
        constructor();
    }

    export class NTexture {
        uvRect: Rect;
        rotated: boolean;
        region: Rect;
        offset: THREE.Vector2;
        originalSize: THREE.Vector2;
        private _root;
        private _nativeTexture;
        constructor(texture?: THREE.Texture, xScale?: number, yScale?: number);
        createSubTexture(region: Rect, rotated?: boolean, offset?: THREE.Vector2, originalSize?: THREE.Vector2): NTexture;
        readonly width: number;
        readonly height: number;
        readonly nativeTexture: THREE.Texture;
        getDrawRect(drawRect: Rect): Rect;
        getUV(uv: Array<THREE.Vector2>): void;
        readonly root: NTexture;
        reload(nativeTexture: THREE.Texture): void;
        dispose(): void;
    }
    export const EmptyTexture: NTexture;

    export class Shape extends DisplayObject {
        constructor();
        drawRect(lineWidth: number, lineColor: Color4, fillColor: Color4): void;
        drawRoundRect(lineWidth: number, lineColor: Color4, fillColor: Color4, topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number): void;
        drawEllipse(lineWidth: number, centerColor: Color4, lineColor: Color4, fillColor: Color4, startDegree?: number, endDegree?: number): void;
        drawPolygon(points: Array<number>, fillColor: Color4, lineWidth?: number, lineColor?: Color4): void;
        drawRegularPolygon(sides: number, lineWidth: number, centerColor: Color4, lineColor: Color4, fillColor: Color4, rotation: number, distances: Array<number>): void;
        clear(): void;
        protected hitTest(context: HitTestContext): DisplayObject;
    }

    type ScreenMode = "none" | "horizontal" | "vertical";
    export var UILayer: number;
    export interface StageInitParameters {
        screenMode?: ScreenMode;
        defaultLayer?: number;
    }
    export class Stage {
        static fontRebuilt?: boolean;
        static audioListener?: AudioListener;
        static disableMatrixValidation: boolean;
        static readonly eventDispatcher: EventDispatcher;
        static init(renderer: THREE.Renderer, parameters?: StageInitParameters): void;

        static scene: THREE.Scene;
        static readonly domElement: HTMLCanvasElement;
        static readonly devicePixelRatio: number;
        static readonly touchScreen: boolean;
        static camera: THREE.Camera;

        static readonly width: number;
        static readonly height: number;
        static readonly touchPos: THREE.Vector2;
        static readonly canvasTransform: THREE.Matrix4;
        static readonly touchTarget: DisplayObject;
        static readonly touchCount: number;
        static getTouchPos(touchId?: number, ret?: THREE.Vector2): THREE.Vector2;
        static addTouchMonitor(touchId: number, target: EventDispatcher): void;
        static removeTouchMonitor(target: EventDispatcher): void;
        static cancelClick(touchId: number): void;
        static update(): void;
        static hitTest(x: number, y: number, forTouch?: boolean): DisplayObject;
        static setFocus(obj: DisplayObject): void;
    }
    type HitTestRay = {
        origin: THREE.Vector3;
        direction: THREE.Vector3;
    };
    export class HitTestContext {
        readonly screenPt: THREE.Vector3;
        forTouch: boolean;
        private _camera;
        private _ray;
        camera: THREE.Camera;

        ray: HitTestRay;

        getLocal(obj: DisplayObject): THREE.Vector2;
    }
    export function screenToWorld(camera: THREE.Camera, x: number, y: number, outPt: THREE.Vector3, outDir: THREE.Vector3): void;
    export function worldToScreen(camera: THREE.Camera, input: THREE.Vector3, output: THREE.Vector2): void;
    export function broadcastEvent(p: THREE.Object3D, type: string, data?: any): void;
    export function bubbleEvent(p: THREE.Object3D, type: string, data?: any, addChain?: Array<EventDispatcher>): void;


    export type GlyphInfo = {
        width: number;
        height: number;
        baseline: number;
    };
    export interface BaseFont {
        name: string;
        version: number;
        mainTexture: NTexture;
        isDynamic?: boolean;
        keepCrisp?: boolean;
        setFormat(format: TextFormat, fontSizeScale: number): void;
        prepareCharacters(text: string): void;
        getGlyph(ch: string, ret: GlyphInfo): boolean;
        drawGlyph(x: number, y: number, vb: VertexBuffer): number;
        drawLine(x: number, y: number, width: number, fontSize: number, type: number, vb: VertexBuffer): number;
        getLineHeight(size: number): number;
    }

    export class BitmapFont implements BaseFont {
        name: string;
        version: number;
        mainTexture: NTexture;
        size: number;
        glyphs: {
            [index: string]: BMGlyph;
        };
        resizable: boolean;
        hasChannel: boolean;
        tint: boolean;
        private _color;
        private _scale;
        private _glyph;
        constructor();
        setFormat(format: TextFormat, fontSizeScale: number): void;
        prepareCharacters(text: string): void;
        getGlyph(ch: string, ret: GlyphInfo): boolean;
        drawGlyph(x: number, y: number, vb: VertexBuffer): number;
        drawLine(x: number, y: number, width: number, fontSize: number, type: number, vb: VertexBuffer): number;
        getLineHeight(size: number): number;
    }
    export class BMGlyph {
        x: number;
        y: number;
        width: number;
        height: number;
        advance: number;
        lineHeight: number;
        channel: number;
        uv: Array<THREE.Vector2>;
    }

    type OutlineGlyph = {
        uvRect: Rect;
        vertRect: Rect;
        chl?: number;
        ver: number;
    };
    type Glyph = {
        uvRect?: Rect;
        vertRect?: Rect;
        advance?: number;
        sourceRect?: Rect;
        chl?: number;
        baseline?: number;
        ver: number;
        outlines?: {
            [index: number]: OutlineGlyph;
        };
    };
    export class DynamicFont {
        version: number;
        mainTexture: NTexture;
        isDynamic: boolean;
        keepCrisp: boolean;
        protected _canvas: HTMLCanvasElement;
        protected _context: CanvasRenderingContext2D;
        protected _texture: THREE.Texture;
        protected _packers: Array<BinPacker>;
        protected _glyphs: {
            [index: number]: Glyph;
        };
        protected _name: string;
        protected _format: TextFormat;
        protected _size: number;
        protected _glyph: Glyph;
        protected _color: Color4;
        protected _outlineColor: Color4;
        protected _scale: number;
        protected eSpan: HTMLSpanElement;
        protected eBlock: HTMLDivElement;
        constructor();
        name: string;
        private createTexture;
        private clearTexture;
        protected rebuild(): void;
        setFormat(format: TextFormat, fontSizeScale: number): void;
        prepareCharacters(text: string): void;
        protected getGlyphsOf(ch: string, size: number): Glyph;
        protected prepareChar(ch: string, size: number, glyph: Glyph): Glyph;
        protected prepareOutline(ch: string, glyph: Glyph, size: number, outline: number): void;
        protected measureChar(ch: string, size: number): Glyph;
        protected addNode(w: number, h: number): Node;
        getGlyph(ch: string, ret: GlyphInfo): boolean;
        drawGlyph(x: number, y: number, vb: VertexBuffer): number;
        drawLine(x: number, y: number, width: number, fontSize: number, type: number, vb: VertexBuffer): number;
        getLineHeight(size: number): number;
        getBaseline(ch: string, font: string, size: number): number;
    }
    type Node = {
        x: number;
        y: number;
        z?: number;
    };
    class BinPacker {
        full?: boolean;
        private _root;
        init(w: number, h: number): void;
        add(w: number, h: number): Node;
        private findNode;
        private splitNode;
    }


    export class FontManager {
        static fonts: {
            [index: string]: BaseFont;
        };
        static packageFontGetter: (name: string) => BaseFont;
        static registerFont(font: BaseFont): void;
        static unregisterFont(font: BaseFont): void;
        static getFont(name: string): BaseFont;
    }

    export class InputTextField extends TextField {
        maxLength: number;
        keyboardType: string;
        restrict: string;
        editable: boolean;
        private _text2;
        private _password;
        private _promptText;
        private _decodedPromptText?;
        private _border;
        private _corner;
        private _borderColor;
        private _backgroundColor;
        private _editing;
        private _element;
        constructor();
        text: string;
        promptText: string;
        password: boolean;
        private updateText;
        protected onSizeChanged(): void;
        applyFormat(): void;
        private createElement;
        private setFormat;
        dispose(): void;
        private __focusIn;
        private locateInputElement;
        private __focusOut;
        private __removed;
    }

    export class RichTextField extends TextField {
        htmlPageContext: IHtmlPageContext;
        htmlParseOptions: HtmlParseOptions;
        constructor();
        getHtmlElement(name: string): HtmlElement;
        showHtmlObject(index: number, show: boolean): void;
        dispose(): void;
        protected cleanupObjects(): void;
        protected refreshObjects(): void;
    }

    export class SelectionShape extends DisplayObject implements IMeshFactory {
        readonly rects: Array<Rect>;
        constructor();
        refresh(): void;
        clear(): void;
        onPopulateMesh(vb: VertexBuffer): void;
        protected hitTest(context: HitTestContext): DisplayObject;
    }

    export class TextField extends DisplayObject implements IMeshFactory {
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
        readonly textFormat: TextFormat;
        applyFormat(): void;
        align: AlignType;

        verticalAlign: VertAlignType;

        text: string;

        htmlText: string;

        readonly parsedText: string;
        autoSize: AutoSizeType;

        wordWrap: boolean;

        singleLine: boolean;

        textWidth: number;

        maxWidth: number;

        readonly htmlElements: Array<HtmlElement>;
        readonly lines: Array<LineInfo>;
        readonly charPositions: Array<CharPosition>;
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
    export const GUTTER_X: number;
    export const GUTTER_Y: number;
    export class LineInfo {
        width: number;
        height: number;
        baseline: number;
        charIndex: number;
        charCount: number;
        y: number;
        y2: number;
    }
    export class CharPosition {
        charIndex: number;
        lineIndex: number;
        offsetX: number;
        vertCount: number;
        width: number;
        imgIndex: number;
    }

    export class TextFormat {
        size: number;
        font: string;
        color: number;
        lineSpacing: number;
        letterSpacing: number;
        bold: boolean;
        underline: boolean;
        italic: boolean;
        strikethrough: boolean;
        align: AlignType;
        outline: number;
        outlineColor: number;
        shadowOffset: THREE.Vector2;
        shadowColor: number;
        copy(source: TextFormat): void;
        equalStyle(aFormat: TextFormat): boolean;
    }

    export type EventType = "touch_begin" | "touch_end" | "touch_move" | "click" | "right_click" | "roll_over" | "roll_out" | "mouse_wheel" | "content_scale_factor_changed" | "added_to_stage" | "removed_from_stage" | "pos_changed" | "size_changed" | "status_changed" | "focus_in" | "focus_out" | "drag_start" | "drag_move" | "drag_end" | "drop" | "scroll" | "scroll_end" | "pull_down_release" | "pull_up_release" | "click_item" | "click_link" | "play_end" | "gear_stop";
    export interface InputInfo {
        x: number;
        y: number;
        mouseWheelDelta: number;
        touchId: number;
        button: number;
        clickCount: number;
        holdTime: number;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        commandKey?: boolean;
    }
    export var lastInput: InputInfo;
    export class Event {
        data: any;
        _defaultPrevented: boolean;
        _stopsPropagation: boolean;
        _touchCapture: boolean;
        _callChain: Array<EventDispatcher>;
        _type: string;
        _sender: EventDispatcher;
        _initiator: DisplayObject;
        constructor();
        readonly type: string;
        readonly sender: EventDispatcher;
        readonly initiator: DisplayObject;
        readonly input: InputInfo;
        stopPropagation(): void;
        preventDefault(): void;
        captureTouch(): void;
        readonly isDefaultPrevented: boolean;
    }
    export var EventPool: Pool<Event>;

    type Listeners = {
        dispatching?: number;
        callbacks: Array<any>;
        captures: Array<any>;
    };
    export class EventDispatcher {
        _listeners: {
            [index: string]: Listeners;
        };
        constructor();
        on(type: EventType, callback: Function, target?: any, capture?: boolean): void;
        on(type: string, callback: Function, target?: any, capture?: boolean): void;
        off(type: EventType, callback: Function, target?: any, capture?: boolean): void;
        off(type: string, callback: Function, target?: any, capture?: boolean): void;
        offAll(type?: EventType): void;
        offAll(type?: string): void;
        hasListener(type: EventType, callback?: Function, target?: any, capture?: boolean): boolean;
        hasListener(type: string, callback?: Function, target?: any, capture?: boolean): boolean;
        dispatchEvent(type: EventType, data?: any): boolean;
        dispatchEvent(type: string, data?: any): boolean;
        _dispatch(col: Listeners, ev: Event, capture?: boolean): void;
    }


    export class GearAnimation extends GearBase {
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }

    export class GearBase {
        static disableAllTweenEffect?: boolean;
        _owner: GObject;
        protected _controller: Controller;
        protected _tweenConfig: GearTweenConfig;
        dispose(): void;
        controller: Controller;
        readonly tweenConfig: GearTweenConfig;
        protected readonly allowTween: boolean;
        setup(buffer: ByteBuffer): void;
        updateFromRelations(dx: number, dy: number): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        protected init(): void;
        apply(): void;
        updateState(): void;
    }
    export class GearTweenConfig {
        tween: boolean;
        easeType: number;
        duration: number;
        delay: number;
        _displayLockToken: number;
        _tweener: GTweener;
        constructor();
    }
    export interface IGearXY {
    }

    export class GearColor extends GearBase {
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }

    export class GearDisplay extends GearBase {
        pages: string[];
        private _visible;
        private _displayLockToken;
        protected init(): void;
        addLock(): number;
        releaseLock(token: number): void;
        readonly connected: boolean;
        apply(): void;
    }

    export class GearDisplay2 extends GearBase {
        pages: string[];
        condition: number;
        private _visible;
        protected init(): void;
        apply(): void;
        evaluate(connected: boolean): boolean;
    }

    export class GearFontSize extends GearBase {
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }

    export class GearIcon extends GearBase {
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }

    export class GearLook extends GearBase {
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        private __tweenUpdate;
        private __tweenComplete;
        updateState(): void;
    }

    export class GearSize extends GearBase {
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        private __tweenUpdate;
        private __tweenComplete;
        updateState(): void;
        updateFromRelations(dx: number, dy: number): void;
    }

    export class GearText extends GearBase {
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        updateState(): void;
    }

    export class GearXY extends GearBase {
        positionsInPercent: boolean;
        private _storage;
        private _default;
        protected init(): void;
        protected addStatus(pageId: string, buffer: ByteBuffer): void;
        addExtStatus(pageId: string, buffer: ByteBuffer): void;
        apply(): void;
        private __tweenUpdate;
        private __tweenComplete;
        updateState(): void;
        updateFromRelations(dx: number, dy: number): void;
    }

    export function evaluateEase(easeType: number, time: number, duration: number, overshootOrAmplitude: number, period: number): number;

    export enum EaseType {
        Linear = 0,
        SineIn = 1,
        SineOut = 2,
        SineInOut = 3,
        QuadIn = 4,
        QuadOut = 5,
        QuadInOut = 6,
        CubicIn = 7,
        CubicOut = 8,
        CubicInOut = 9,
        QuartIn = 10,
        QuartOut = 11,
        QuartInOut = 12,
        QuintIn = 13,
        QuintOut = 14,
        QuintInOut = 15,
        ExpoIn = 16,
        ExpoOut = 17,
        ExpoInOut = 18,
        CircIn = 19,
        CircOut = 20,
        CircInOut = 21,
        ElasticIn = 22,
        ElasticOut = 23,
        ElasticInOut = 24,
        BackIn = 25,
        BackOut = 26,
        BackInOut = 27,
        BounceIn = 28,
        BounceOut = 29,
        BounceInOut = 30,
        Custom = 31
    }

    export class GPath {
        private _segments;
        private _points;
        private _fullLength;
        constructor();
        readonly length: number;
        create2(pt1: GPathPoint, pt2: GPathPoint, pt3?: GPathPoint, pt4?: GPathPoint): void;
        create(points: Array<GPathPoint>): void;
        private createSplineSegment;
        clear(): void;
        getPointAt(t: number, result?: THREE.Vector2): THREE.Vector2;
        readonly segmentCount: number;
        getAnchorsInSegment(segmentIndex: number, points?: Array<THREE.Vector2>): Array<THREE.Vector2>;
        getPointsInSegment(segmentIndex: number, t0: number, t1: number, points?: Array<THREE.Vector2>, ts?: Array<number>, pointDensity?: number): Array<THREE.Vector2>;
        getAllPoints(points?: Array<THREE.Vector2>, ts?: Array<number>, pointDensity?: number): Array<THREE.Vector2>;
        private onCRSplineCurve;
        private onBezierCurve;
    }

    export enum CurveType {
        CRSpline = 0,
        Bezier = 1,
        CubicBezier = 2,
        Straight = 3
    }
    export class GPathPoint {
        x: number;
        y: number;
        control1_x: number;
        control1_y: number;
        control2_x: number;
        control2_y: number;
        curveType: number;
        constructor();
        static newPoint(x: number, y: number, curveType: number): GPathPoint;
        static newBezierPoint(x: number, y: number, control1_x: number, control1_y: number): GPathPoint;
        static newCubicBezierPoint(x: number, y: number, control1_x: number, control1_y: number, control2_x: number, control2_y: number): GPathPoint;
        clone(): GPathPoint;
    }

    export class GTween {
        static catchCallbackExceptions: boolean;
        static to(start: number, end: number, duration: number): GTweener;
        static to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
        static to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
        static to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
        static toColor(start: number, end: number, duration: number): GTweener;
        static delayedCall(delay: number): GTweener;
        static shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
        static isTweening(target: any, propType?: any): Boolean;
        static kill(target: any, complete?: boolean, propType?: any): void;
        static getTween(target: any, propType?: any): GTweener;
    }

    export class GTweener {
        _target: any;
        _propType: any;
        _killed: boolean;
        _paused: boolean;
        private _delay;
        private _duration;
        private _breakpoint;
        private _easeType;
        private _easeOvershootOrAmplitude;
        private _easePeriod;
        private _repeat;
        private _yoyo;
        private _timeScale;
        private _snapping;
        private _userData;
        private _path;
        private _onUpdate;
        private _onStart;
        private _onComplete;
        private _onUpdateCaller;
        private _onStartCaller;
        private _onCompleteCaller;
        private _startValue;
        private _endValue;
        private _value;
        private _deltaValue;
        private _valueSize;
        private _started;
        private _ended;
        private _elapsedTime;
        private _normalizedTime;
        constructor();
        setDelay(value: number): GTweener;
        readonly delay: number;
        setDuration(value: number): GTweener;
        readonly duration: number;
        setBreakpoint(value: number): GTweener;
        setEase(value: number): GTweener;
        setEasePeriod(value: number): GTweener;
        setEaseOvershootOrAmplitude(value: number): GTweener;
        setRepeat(repeat: number, yoyo?: boolean): GTweener;
        readonly repeat: number;
        setTimeScale(value: number): GTweener;
        setSnapping(value: boolean): GTweener;
        setTarget(value: any, propType?: any): GTweener;
        readonly target: any;
        setPath(value: GPath): GTweener;
        setUserData(value: any): GTweener;
        readonly userData: any;
        onUpdate(callback: Function, target?: any): GTweener;
        onStart(callback: Function, target?: any): GTweener;
        onComplete(callback: Function, target?: any): GTweener;
        readonly startValue: TweenValue;
        readonly endValue: TweenValue;
        readonly value: TweenValue;
        readonly deltaValue: TweenValue;
        readonly normalizedTime: number;
        readonly completed: boolean;
        readonly allCompleted: boolean;
        setPaused(paused: boolean): GTweener;
        /**
         * seek position of the tween, in seconds.
         */
        seek(time: number): void;
        kill(complete?: boolean): void;
        _to(start: number, end: number, duration: number): GTweener;
        _to2(start: number, start2: number, end: number, end2: number, duration: number): GTweener;
        _to3(start: number, start2: number, start3: number, end: number, end2: number, end3: number, duration: number): GTweener;
        _to4(start: number, start2: number, start3: number, start4: number, end: number, end2: number, end3: number, end4: number, duration: number): GTweener;
        _toColor(start: number, end: number, duration: number): GTweener;
        _shake(startX: number, startY: number, amplitude: number, duration: number): GTweener;
        _init(): void;
        _reset(): void;
        _update(dt: number): void;
        private update;
        private callStartCallback;
        private callUpdateCallback;
        private callCompleteCallback;
    }

    export class TweenManager {
        static createTween(): GTweener;
        static isTweening(target: any, propType?: any): boolean;
        static killTweens(target: any, completed?: boolean, propType?: any): boolean;
        static getTween(target: any, propType?: any): GTweener;
        static update(): void;
    }

    export class TweenValue {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor();
        color: number;
        getField(index: number): number;
        setField(index: number, value: number): void;
        setZero(): void;
    }

    export class AsyncOperation {
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

    export class Controller extends EventDispatcher {
        private _selectedIndex;
        private _previousIndex;
        private _pageIds;
        private _pageNames;
        private _actions?;
        name: string;
        parent: GComponent;
        autoRadioGroupDepth?: boolean;
        changing: boolean;
        constructor();
        dispose(): void;
        selectedIndex: number;
        setSelectedIndex(value: number): void;
        readonly previsousIndex: number;
        selectedPage: string;
        setSelectedPage(value: string): void;
        readonly previousPage: string;
        readonly pageCount: number;
        getPageName(index: number): string;
        addPage(name?: string): void;
        addPageAt(name?: string, index?: number): void;
        removePage(name: string): void;
        removePageAt(index: number): void;
        clearPages(): void;
        hasPage(aName: string): boolean;
        getPageIndexById(aId: string): number;
        getPageIdByName(aName: string): string;
        getPageNameById(aId: string): string;
        getPageId(index: number): string;
        selectedPageId: string;

        oppositePageId: string;
        readonly previousPageId: string;
        runActions(): void;
        setup(buffer: ByteBuffer): void;
    }

    export class DragDropManager {
        private _agent;
        private _sourceData;
        static readonly inst: DragDropManager;
        constructor();
        readonly dragAgent: GObject;
        readonly dragging: boolean;
        startDrag(icon: string, sourceData?: any, touchPointID?: number): void;
        cancel(): void;
        private __dragEnd;
    }

    export type AlignType = "left" | "center" | "right";
    export type VertAlignType = "top" | "middle" | "bottom";
    export enum ButtonMode {
        Common = 0,
        Check = 1,
        Radio = 2
    }
    export enum AutoSizeType {
        None = 0,
        Both = 1,
        Height = 2,
        Shrink = 3
    }
    export enum LoaderFillType {
        None = 0,
        Scale = 1,
        ScaleMatchHeight = 2,
        ScaleMatchWidth = 3,
        ScaleFree = 4,
        ScaleNoBorder = 5
    }
    export enum ListLayoutType {
        SingleColumn = 0,
        SingleRow = 1,
        FlowHorizontal = 2,
        FlowVertical = 3,
        Pagination = 4
    }
    export enum ListSelectionMode {
        Single = 0,
        Multiple = 1,
        Multiple_SingleClick = 2,
        None = 3
    }
    export enum OverflowType {
        Visible = 0,
        Hidden = 1,
        Scroll = 2
    }
    export enum PackageItemType {
        Image = 0,
        MovieClip = 1,
        Sound = 2,
        Component = 3,
        Atlas = 4,
        Font = 5,
        Swf = 6,
        Misc = 7,
        Unknown = 8
    }
    export enum ObjectType {
        Image = 0,
        MovieClip = 1,
        Swf = 2,
        Graph = 3,
        Loader = 4,
        Group = 5,
        Text = 6,
        RichText = 7,
        InputText = 8,
        Component = 9,
        List = 10,
        Label = 11,
        Button = 12,
        ComboBox = 13,
        ProgressBar = 14,
        Slider = 15,
        ScrollBar = 16,
        Tree = 17,
        Loader3D = 18
    }
    export enum ProgressTitleType {
        Percent = 0,
        ValueAndMax = 1,
        Value = 2,
        Max = 3
    }
    export enum ScrollBarDisplayType {
        Default = 0,
        Visible = 1,
        Auto = 2,
        Hidden = 3
    }
    export enum ScrollType {
        Horizontal = 0,
        Vertical = 1,
        Both = 2
    }
    export enum FlipType {
        None = 0,
        Horizontal = 1,
        Vertical = 2,
        Both = 3
    }
    export enum ChildrenRenderOrder {
        Ascent = 0,
        Descent = 1,
        Arch = 2
    }
    export enum GroupLayoutType {
        None = 0,
        Horizontal = 1,
        Vertical = 2
    }
    export enum PopupDirection {
        Auto = 0,
        Up = 1,
        Down = 2
    }
    export enum RelationType {
        Left_Left = 0,
        Left_Center = 1,
        Left_Right = 2,
        Center_Center = 3,
        Right_Left = 4,
        Right_Center = 5,
        Right_Right = 6,
        Top_Top = 7,
        Top_Middle = 8,
        Top_Bottom = 9,
        Middle_Middle = 10,
        Bottom_Top = 11,
        Bottom_Middle = 12,
        Bottom_Bottom = 13,
        Width = 14,
        Height = 15,
        LeftExt_Left = 16,
        LeftExt_Right = 17,
        RightExt_Left = 18,
        RightExt_Right = 19,
        TopExt_Top = 20,
        TopExt_Bottom = 21,
        BottomExt_Top = 22,
        BottomExt_Bottom = 23,
        Size = 24
    }
    export enum FillMethod {
        None = 0,
        Horizontal = 1,
        Vertical = 2,
        Radial90 = 3,
        Radial180 = 4,
        Radial360 = 5
    }
    export enum FillOrigin {
        Top = 0,
        Bottom = 1,
        Left = 2,
        Right = 3,
        TopLeft = 0,
        TopRight = 1,
        BottomLeft = 2,
        BottomRight = 3
    }
    export enum FillOrigin90 {
        TopLeft = 0,
        TopRight = 1,
        BottomLeft = 2,
        BottomRight = 3
    }
    export enum ObjectPropID {
        Text = 0,
        Icon = 1,
        Color = 2,
        OutlineColor = 3,
        Playing = 4,
        Frame = 5,
        DeltaTime = 6,
        TimeScale = 7,
        FontSize = 8,
        Selected = 9
    }

    export type ButtonStatus = "up" | "down" | "over" | "selectedOver" | "disabled" | "selectedDisabled";
    export class GButton extends GComponent {
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        private _mode;
        private _selected;
        private _title;
        private _selectedTitle;
        private _icon;
        private _selectedIcon;
        private _sound;
        private _soundVolumeScale;
        private _buttonController;
        private _relatedController;
        private _relatedPageId;
        private _changeStateOnClick;
        private _linkedPopup;
        private _downEffect;
        private _downEffectValue;
        private _downScaled;
        private _down;
        private _over;
        constructor();
        icon: string;

        selectedIcon: string;

        title: string;

        text: string;

        selectedTitle: string;

        titleColor: number;

        titleFontSize: number;

        sound: string;

        soundVolumeScale: number;

        selected: boolean;
        mode: number;

        relatedController: Controller;

        relatedPageId: string;

        changeStateOnClick: boolean;

        linkedPopup: GObject;

        getTextField(): GTextField;
        fireClick(downEffect?: boolean, clickCall?: boolean): void;
        protected setState(val: ButtonStatus): void;
        protected setCurrentState(): void;
        handleControllerChanged(c: Controller): void;
        protected handleGrayedChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        protected constructExtension(buffer: ByteBuffer): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private __rollover;
        private __rollout;
        private __btnTouchBegin;
        private __btnTouchEnd;
        private __removeFromStage;
        private __click;
    }

    export class GComboBox extends GComponent {
        dropdown: GComponent;
        popupDirection: PopupDirection;
        visibleItemCount: number;
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        protected _list: GList;
        protected _items: string[];
        protected _icons?: string[];
        protected _values: string[];
        private _itemsUpdated;
        private _selectedIndex;
        private _buttonController;
        private _selectionController;
        private _down;
        private _over;
        constructor();
        text: string;

        titleColor: number;

        titleFontSize: number;

        icon: string;

        items: string[];

        icons: string[];

        values: string[];

        selectedIndex: number;

        value: string;
        getTextField(): GTextField;
        protected setState(val: string): void;
        protected setCurrentState(): void;
        readonly selectionController: Controller;

        handleControllerChanged(c: Controller): void;
        private updateSelectionController;
        dispose(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        protected constructExtension(buffer: ByteBuffer): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        protected showDropdown(): void;
        private __popupWinClosed;
        private __clickItem;
        private __rollover;
        private __rollout;
        private __mousedown;
        private __mouseup;
    }

    export class GComponent extends GObject {
        private _sortingChildCount;
        private _applyingController?;
        protected _margin: Margin;
        protected _trackBounds: boolean;
        protected _boundsChanged: boolean;
        protected _childrenRenderOrder: number;
        protected _apexIndex: number;
        _buildingDisplayList: boolean;
        _children: GObject[];
        _controllers: Controller[];
        _transitions: Transition[];
        _container: DisplayObject;
        _scrollPane: ScrollPane;
        _alignOffset: THREE.Vector2;
        constructor();
        protected createDisplayObject(): void;
        dispose(): void;
        readonly displayListContainer: DisplayObject;
        addChild(child: GObject): GObject;
        addChildAt(child: GObject, index: number): GObject;
        private getInsertPosForSortingChild;
        removeChild(child: GObject, dispose?: boolean): GObject;
        removeChildAt(index: number, dispose?: boolean): GObject;
        removeChildren(beginIndex?: number, endIndex?: number, dispose?: boolean): void;
        getChildAt(index: number): GObject;
        getChild(name: string): GObject;
        getChildByPath(path: string): GObject;
        getVisibleChild(name: string): GObject;
        getChildInGroup(name: string, group: GGroup): GObject;
        getChildById(id: string): GObject;
        getChildIndex(child: GObject): number;
        setChildIndex(child: GObject, index: number): void;
        setChildIndexBefore(child: GObject, index: number): number;
        private _setChildIndex;
        swapChildren(child1: GObject, child2: GObject): void;
        swapChildrenAt(index1: number, index2: number): void;
        readonly numChildren: number;
        isAncestorOf(child: GObject): boolean;
        addController(controller: Controller): void;
        getControllerAt(index: number): Controller;
        getController(name: string): Controller;
        removeController(c: Controller): void;
        readonly controllers: Controller[];
        childStateChanged(child: GObject): void;
        private buildNativeDisplayList;
        applyController(c: Controller): void;
        applyAllControllers(): void;
        adjustRadioGroupDepth(obj: GObject, c: Controller): void;
        getTransitionAt(index: number): Transition;
        getTransition(transName: string): Transition;
        isChildInView(child: GObject): boolean;
        getFirstChildInView(): number;
        readonly scrollPane: ScrollPane;
        opaque: boolean;

        margin: Margin;

        childrenRenderOrder: number;

        apexIndex: number;

        readonly baseUserData: string;
        protected updateMask(): void;
        protected setupScroll(buffer: ByteBuffer): void;
        protected setupOverflow(overflow: number): void;
        protected handleSizeChanged(): void;
        protected handleGrayedChanged(): void;
        handleControllerChanged(c: Controller): void;
        setBoundsChangedFlag(): void;
        private __render;
        ensureBoundsCorrect(): void;
        protected updateBounds(): void;
        setBounds(ax: number, ay: number, aw: number, ah: number): void;
        viewWidth: number;

        viewHeight: number;

        getSnappingPosition(xValue: number, yValue: number, resultPoint?: THREE.Vector2): THREE.Vector2;
        /**
         * dir正数表示右移或者下移，负数表示左移或者上移
         */
        getSnappingPositionWithDir(xValue: number, yValue: number, xDir: number, yDir: number, resultPoint?: THREE.Vector2): THREE.Vector2;
        childSortingOrderChanged(child: GObject, oldValue: number, newValue: number): void;
        constructFromResource(): void;
        constructFromResource2(objectPool: GObject[], poolIndex: number): void;
        protected constructExtension(buffer: ByteBuffer): void;
        protected onConstruct(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GGraph extends GObject {
        private _shape;
        constructor();
        readonly shape: Shape;
        color: number;

        protected createDisplayObject(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GGroup extends GObject {
        private _layout;
        private _lineGap;
        private _columnGap;
        private _excludeInvisibles?;
        private _autoSizeDisabled?;
        private _mainGridIndex;
        private _mainGridMinSize;
        private _boundsChanged;
        private _percentReady;
        private _mainChildIndex;
        private _totalSize;
        private _numChildren;
        _updating: number;
        constructor();
        dispose(): void;
        /**
         * @see GroupLayout
         */
        layout: number;

        lineGap: number;

        columnGap: number;

        excludeInvisibles: boolean;

        autoSizeDisabled: boolean;

        mainGridMinSize: number;

        mainGridIndex: number;

        setBoundsChangedFlag(positionChangedOnly?: boolean): void;
        ensureBoundsCorrect(): void;
        private updateBounds;
        private handleLayout;
        moveChildren(dx: number, dy: number): void;
        resizeChildren(dw: number, dh: number): void;
        protected handleAlphaChanged(): void;
        handleVisibleChanged(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GImage extends GObject {
        private _image;
        private _contentItem;
        constructor();
        color: number;

        flip: number;

        fillMethod: number;

        fillOrigin: number;

        fillClockwise: boolean;

        fillAmount: number;

        protected createDisplayObject(): void;
        protected handleSizeChanged(): void;
        constructFromResource(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GLabel extends GComponent {
        protected _titleObject: GObject;
        protected _iconObject: GObject;
        constructor();
        icon: string;
        title: string;
        text: string;
        titleColor: number;
        titleFontSize: number;
        color: number;
        editable: boolean;
        getTextField(): GTextField;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        protected constructExtension(buffer: ByteBuffer): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GList extends GComponent {
        itemRenderer: (index: number, item: GObject) => void;
        itemProvider: (index: number) => string;
        scrollItemToViewOnClick: boolean;
        foldInvisibleItems: boolean;
        private _layout;
        private _lineCount;
        private _columnCount;
        private _lineGap;
        private _columnGap;
        private _defaultItem;
        private _autoResizeItem;
        private _selectionMode;
        private _align;
        private _valign;
        private _selectionController?;
        private _lastSelectedIndex;
        private _pool;
        private _virtual;
        private _loop;
        private _numItems;
        private _realNumItems;
        private _firstIndex;
        private _curLineItemCount;
        private _curLineItemCount2;
        private _itemSize;
        private _virtualListChanged;
        private _virtualItems;
        private _eventLocked;
        private itemInfoVer;
        constructor();
        dispose(): void;
        layout: number;

        lineCount: number;

        columnCount: number;

        lineGap: number;

        columnGap: number;

        align: AlignType;

        verticalAlign: VertAlignType;

        virtualItemSize: THREE.Vector2;

        defaultItem: string;

        autoResizeItem: boolean;

        selectionMode: number;

        selectionController: Controller;

        readonly itemPool: GObjectPool;
        getFromPool(url?: string): GObject;
        returnToPool(obj: GObject): void;
        addChildAt(child: GObject, index: number): GObject;
        addItem(url?: string): GObject;
        addItemFromPool(url?: string): GObject;
        removeChildAt(index: number, dispose?: boolean): GObject;
        removeChildToPoolAt(index: number): void;
        removeChildToPool(child: GObject): void;
        removeChildrenToPool(beginIndex?: number, endIndex?: number): void;
        selectedIndex: number;

        getSelection(result?: number[]): number[];
        addSelection(index: number, scrollItToView?: boolean): void;
        removeSelection(index: number): void;
        clearSelection(): void;
        private clearSelectionExcept;
        selectAll(): void;
        selectNone(): void;
        selectReverse(): void;
        handleArrowKey(dir: number): void;
        private __clickItem;
        protected dispatchItemEvent(item: GObject, evt: Event): void;
        private setSelectionOnEvent;
        resizeToFit(itemCount?: number, minSize?: number): void;
        getMaxItemWidth(): number;
        protected handleSizeChanged(): void;
        handleControllerChanged(c: Controller): void;
        private updateSelectionController;
        private shouldSnapToNext;
        getSnappingPositionWithDir(xValue: number, yValue: number, xDir: number, yDir: number, resultPoint?: THREE.Vector2): THREE.Vector2;
        scrollToView(index: number, ani?: boolean, setFirst?: boolean): void;
        getFirstChildInView(): number;
        childIndexToItemIndex(index: number): number;
        itemIndexToChildIndex(index: number): number;
        setVirtual(): void;
        /**
         * Set the list to be virtual list, and has loop behavior.
         */
        setVirtualAndLoop(): void;
        private _setVirtual;
        numItems: number;
        refreshVirtualList(): void;
        private checkVirtualList;
        private setVirtualListChangedFlag;
        private _refreshVirtualList;
        private __scrolled;
        private getIndexOnPos1;
        private getIndexOnPos2;
        private getIndexOnPos3;
        private handleScroll;
        private handleScroll1;
        private handleScroll2;
        private handleScroll3;
        private handleArchOrder1;
        private handleArchOrder2;
        private handleAlign;
        protected updateBounds(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        protected readItems(buffer: ByteBuffer): void;
        protected setupItem(buffer: ByteBuffer, obj: GObject): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GLoader extends GObject {
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
        url: string;

        icon: string;

        align: AlignType;

        verticalAlign: VertAlignType;

        fill: number;

        shrinkOnly: boolean;

        autoSize: boolean;

        playing: boolean;

        frame: number;

        color: number;

        fillMethod: number;

        fillOrigin: number;

        fillClockwise: boolean;

        fillAmount: number;

        readonly content: MovieClip;
        readonly component: GComponent;
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

    export class GLoader3D extends GObject {
    }

    export class GMovieClip extends GObject {
        private _movieClip;
        constructor();
        color: number;
        protected createDisplayObject(): void;
        playing: boolean;
        frame: number;
        timeScale: number;
        rewind(): void;
        syncStatus(anotherMc: GMovieClip): void;
        advance(timeInMiniseconds: number): void;
        setPlaySettings(start?: number, end?: number, times?: number, endAt?: number): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        constructFromResource(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GObject {
        data?: any;
        packageItem?: PackageItem;
        static draggingObject: GObject;
        private _x;
        private _y;
        private _z;
        private _alpha;
        private _visible;
        private _touchable;
        private _grayed;
        private _draggable;
        private _scaleX;
        private _scaleY;
        private _skewX;
        private _skewY;
        private _pivotX;
        private _pivotY;
        private _pivotAsAnchor;
        private _sortingOrder;
        private _internalVisible;
        private _handlingController?;
        private _tooltips;
        private _relations;
        private _group;
        private _gears;
        private _dragBounds;
        protected _displayObject: DisplayObject;
        minWidth: number;
        minHeight: number;
        maxWidth: number;
        maxHeight: number;
        sourceWidth: number;
        sourceHeight: number;
        initWidth: number;
        initHeight: number;
        _parent: GComponent;
        _width: number;
        _height: number;
        _rawWidth: number;
        _rawHeight: number;
        _id: string;
        _name: string;
        _underConstruct: boolean;
        _gearLocked: boolean;
        _sizePercentInGroup: number;
        _treeNode?: GTreeNode;
        constructor();
        readonly id: string;
        name: string;
        x: number;
        y: number;
        z: number;
        setPosition(xv: number, yv: number, zv?: number): void;
        readonly xMin: number;
        readonly yMin: number;
        center(restraint?: boolean): void;
        readonly width: number;
        readonly height: number;
        setSize(wv: number, hv: number, ignorePivot?: boolean): void;
        protected setSizeDirectly(wv: number, hv: number): void;
        makeFullScreen(): void;
        readonly actualWidth: number;
        readonly actualHeight: number;
        scaleX: number;

        scaleY: number;

        setScale(sx: number, sy: number): void;
        skewX: number;

        skewY: number;

        setSkew(sx: number, sy: number): void;
        pivotX: number;

        pivotY: number;

        setPivot(xv: number, yv: number, asAnchor?: boolean): void;
        readonly pivotAsAnchor: boolean;
        touchable: boolean;
        grayed: boolean;

        enabled: boolean;

        rotation: number;

        rotationX: number;

        rotationY: number;

        alpha: number;

        visible: boolean;

        readonly internalVisible: boolean;
        readonly internalVisible2: boolean;
        readonly internalVisible3: boolean;
        sortingOrder: number;
        tooltips: string;

        private __rollOver;
        private __doShowTooltips;
        private __rollOut;
        blendMode: THREE.Blending;
        readonly onStage: boolean;
        readonly resourceURL: string;

        group: GGroup;
        getGear(index: number): GearBase;
        protected updateGear(index: number): void;
        checkGearController(index: number, c: Controller): boolean;
        updateGearFromRelations(index: number, dx: number, dy: number): void;
        addDisplayLock(): number;
        releaseDisplayLock(token: number): void;
        private checkGearDisplay;
        readonly relations: Relations;
        addRelation(target: GObject, relationType: number, usePercent?: boolean): void;
        removeRelation(target: GObject, relationType: number): void;
        readonly displayObject: DisplayObject;
        readonly obj3D: THREE.Object3D;
        parent: GComponent;
        removeFromParent(): void;
        readonly asCom: GComponent;
        text: string;
        icon: string;
        readonly treeNode: GTreeNode;
        readonly isDisposed: boolean;
        dispose(): void;
        on(type: EventType, callback: Function, target?: any, capture?: boolean): void;
        on(type: string, callback: Function, target?: any, capture?: boolean): void;
        off(type: EventType, callback: Function, target?: any, capture?: boolean): void;
        off(type: string, callback: Function, target?: any, capture?: boolean): void;
        offAll(type?: EventType): void;
        offAll(type?: string): void;
        hasListener(type: EventType, callback?: Function, target?: any, capture?: boolean): boolean;
        hasListener(type: string, callback?: Function, target?: any, capture?: boolean): boolean;
        dispatchEvent(type: EventType, data?: any): boolean;
        dispatchEvent(type: string, data?: any): boolean;
        onClick(listener: Function, target?: any): void;
        offClick(listener: Function, target?: any): void;
        hasClickListener(): boolean;
        readonly draggable: boolean;
        readonly dragBounds: Rect;
        startDrag(touchId?: number): void;
        stopDrag(): void;
        readonly dragging: boolean;
        localToGlobal(ax?: number, ay?: number, result?: THREE.Vector2): THREE.Vector2;
        globalToLocal(ax?: number, ay?: number, result?: THREE.Vector2): THREE.Vector2;
        localToRoot(ax: number, ay: number, result?: THREE.Vector2): THREE.Vector2;
        rootToLocal(ax: number, ay: number, result?: THREE.Vector2): THREE.Vector2;
        localToGlobalRect(ax: number, ay: number, aWidth: number, aHeight: number, result?: Rect): Rect;
        globalToLocalRect(ax: number, ay: number, aWidth: number, aHeight: number, result?: Rect): Rect;
        handleControllerChanged(c: Controller): void;
        protected createDisplayObject(): void;
        protected handlePositionChanged(): void;
        protected handleSizeChanged(): void;
        protected handleScaleChanged(): void;
        protected handleGrayedChanged(): void;
        protected handleAlphaChanged(): void;
        handleVisibleChanged(): void;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        constructFromResource(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private _dragStartPos;
        private _dragTesting;
        private initDrag;
        private dragBegin;
        private dragEnd;
        private __touchBegin;
        private __touchMove;
        private __touchEnd;
        static cast(obj: any): GObject;
    }
    export interface IGRoot {
        inst: any;
        findFor(obj: GObject): any;
    }
    export var Decls: {
        GRoot?: IGRoot;
    };
    export var gInstanceCounter: number;
    export var constructingDepth: {
        n: number;
    };

    export class GObjectPool {
        private _pool;
        private _count;
        constructor();
        clear(): void;
        readonly count: number;
        getObject(url: string): GObject;
        returnObject(obj: GObject): void;
    }

    export class GProgressBar extends GComponent {
        private _min;
        private _max;
        private _value;
        private _titleType;
        private _reverse;
        private _titleObject;
        private _aniObject;
        private _barObjectH;
        private _barObjectV;
        private _barMaxWidth;
        private _barMaxHeight;
        private _barMaxWidthDelta;
        private _barMaxHeightDelta;
        private _barStartX;
        private _barStartY;
        constructor();
        titleType: number;
        min: number;
        max: number;
        value: number;
        tweenValue(value: number, duration: number): GTweener;
        update(newValue: number): void;
        private setFillAmount;
        protected constructExtension(buffer: ByteBuffer): void;
        protected handleSizeChanged(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GRichTextField extends GTextField {
        constructor();
        protected createDisplayObject(): void;
        protected setText(): void;
    }

    export class GRoot extends GComponent {
        private _modalLayer;
        private _popupStack;
        private _justClosedPopups;
        private _modalWaitPane;
        private _tooltipWin;
        private _defaultTooltipWin;
        static readonly inst: GRoot;
        static findFor(obj: GObject): GRoot;
        constructor();
        private applyScaleFactor;
        showWindow(win: Window): void;
        hideWindow(win: Window): void;
        hideWindowImmediately(win: Window): void;
        bringToFront(win: Window): void;
        showModalWait(msg?: string): void;
        closeModalWait(): void;
        closeAllExceptModals(): void;
        closeAllWindows(): void;
        getTopWindow(): Window;
        readonly modalLayer: GObject;
        readonly hasModalWindow: boolean;
        readonly modalWaiting: boolean;
        showPopup(popup: GObject, target?: GObject, dir?: PopupDirection): void;
        togglePopup(popup: GObject, target?: GObject, dir?: PopupDirection): void;
        hidePopup(popup?: GObject): void;
        readonly hasAnyPopup: boolean;
        private closePopup;
        showTooltips(msg: string): void;
        showTooltipsWin(tooltipWin: GObject, xx?: number, yy?: number): void;
        hideTooltips(): void;
        playOneShotSound(url: string, volumeScale?: number): void;
        private adjustModalLayer;
        checkPopups(): void;
        private __stageTouchBegin;
    }

    export class GScrollBar extends GComponent {
        private _grip;
        private _arrowButton1;
        private _arrowButton2;
        private _bar;
        private _target;
        private _vertical;
        private _scrollPerc;
        private _fixedGripSize;
        private _dragOffset;
        private _gripDragging;
        constructor();
        setScrollPane(target: ScrollPane, vertical: boolean): void;
        setDisplayPerc(value: number): void;
        setScrollPerc(val: number): void;
        readonly minSize: number;
        readonly gripDragging: boolean;
        protected constructExtension(buffer: ByteBuffer): void;
        private __gripTouchBegin;
        private __gripTouchMove;
        private __gripTouchEnd;
        private __arrowButton1Click;
        private __arrowButton2Click;
        private __barTouchBegin;
    }

    export class GSlider extends GComponent {
        changeOnClick: boolean;
        canDrag: boolean;
        private _min;
        private _max;
        private _value;
        private _titleType;
        private _reverse;
        private _wholeNumbers;
        private _titleObject;
        private _barObjectH;
        private _barObjectV;
        private _barMaxWidth;
        private _barMaxHeight;
        private _barMaxWidthDelta;
        private _barMaxHeightDelta;
        private _gripObject;
        private _clickPos;
        private _clickPercent;
        private _barStartX;
        private _barStartY;
        constructor();
        titleType: number;
        wholeNumbers: boolean;
        min: number;
        max: number;
        value: number;
        update: void;
        private updateWithPercent;
        protected constructExtension(buffer: ByteBuffer): void;
        protected handleSizeChanged(): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        private __gripTouchBegin;
        private __gripTouchMove;
        private __barTouchBegin;
    }

    export type TextTemplate = {
        [index: string]: string;
    };
    export class GTextField extends GObject {
        protected _textField: TextField | RichTextField | InputTextField;
        protected _text: string;
        protected _ubbEnabled: boolean;
        protected _updatingSize: boolean;
        protected _template: TextTemplate;
        constructor();
        protected createDisplayObject(): void;
        text: string;
        protected setText(): void;
        textTemplate: TextTemplate;
        setVar(name: string, value: string): GTextField;
        flushVars(): void;
        readonly textFormat: TextFormat;
        applyFormat(): void;
        align: AlignType;
        verticalAlign: VertAlignType;
        singleLine: boolean;
        ubbEnabled: boolean;
        autoSize: number;
        readonly textWidth: number;
        readonly textHeight: number;
        color: number;
        getProp(index: number): any;
        setProp(index: number, value: any): void;
        private updateSize;
        protected handleSizeChanged(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        setup_afterAdd(buffer: ByteBuffer, beginPos: number): void;
        protected parseTemplate(template: string): string;
    }

    export class GTextInput extends GTextField {
        constructor();
        protected createDisplayObject(): void;
        password: boolean;
        keyboardType: string;
        editable: boolean;
        maxLength: number;
        promptText: string;
        restrict: string;
        requestFocus(): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
    }

    export class GTree extends GList {
        treeNodeRender: (node: GTreeNode, obj: GComponent) => void;
        treeNodeWillExpand: (node: GTreeNode, expanded: boolean) => void;
        private _indent;
        private _clickToExpand;
        private _rootNode;
        private _expandedStatusInEvt;
        constructor();
        readonly rootNode: GTreeNode;
        indent: number;

        clickToExpand: number;
        getSelectedNode(): GTreeNode;
        getSelectedNodes(result?: Array<GTreeNode>): Array<GTreeNode>;
        selectNode(node: GTreeNode, scrollItToView?: boolean): void;
        unselectNode(node: GTreeNode): void;
        expandAll(folderNode?: GTreeNode): void;
        collapseAll(folderNode?: GTreeNode): void;
        private createCell;
        _afterInserted(node: GTreeNode): void;
        private getInsertIndexForNode;
        _afterRemoved(node: GTreeNode): void;
        _afterExpanded(node: GTreeNode): void;
        _afterCollapsed(node: GTreeNode): void;
        _afterMoved(node: GTreeNode): void;
        private getFolderEndIndex;
        private checkChildren;
        private hideFolderNode;
        private removeNode;
        private __cellMouseDown;
        private __expandedStateChanged;
        protected dispatchItemEvent(item: GObject, evt: Event): void;
        setup_beforeAdd(buffer: ByteBuffer, beginPos: number): void;
        protected readItems(buffer: ByteBuffer): void;
    }

    export class GTreeNode {
        data?: any;
        private _parent;
        private _children;
        private _expanded;
        private _level;
        private _tree;
        _cell: GComponent;
        _resURL: string;
        constructor(hasChild: boolean, resURL?: string);

        expanded: boolean;
        readonly isFolder: boolean;
        readonly parent: GTreeNode;
        text: string;
        icon: string;
        readonly cell: GComponent;
        readonly level: number;
        _setLevel(value: number): void;
        addChild(child: GTreeNode): GTreeNode;
        addChildAt(child: GTreeNode, index: number): GTreeNode;
        removeChild(child: GTreeNode): GTreeNode;
        removeChildAt(index: number): GTreeNode;
        removeChildren(beginIndex?: number, endIndex?: number): void;
        getChildAt(index: number): GTreeNode;
        getChildIndex(child: GTreeNode): number;
        getPrevSibling(): GTreeNode;
        getNextSibling(): GTreeNode;
        setChildIndex(child: GTreeNode, index: number): void;
        swapChildren(child1: GTreeNode, child2: GTreeNode): void;
        swapChildrenAt(index1: number, index2: number): void;
        readonly numChildren: number;
        expandToRoot(): void;
        readonly tree: GTree;
        _setTree(value: GTree): void;
    }

    export class Margin {
        left: number;
        right: number;
        top: number;
        bottom: number;
        copy(source: Margin): void;
    }

    export class PackageItem {
        owner: UIPackage;
        type: number;
        objectType: number;
        id: string;
        name: string;
        width: number;
        height: number;
        file: string;
        decoded?: boolean;
        rawData?: ByteBuffer;
        highResolution?: Array<string>;
        branches?: Array<string>;
        scale9Grid?: Rect;
        scaleByTile?: boolean;
        tileGridIndice?: number;
        smoothing?: boolean;
        texture?: NTexture;
        pixelHitTestData?: PixelHitTestData;
        interval?: number;
        repeatDelay?: number;
        swing?: boolean;
        frames?: Frame[];
        extensionType?: any;
        bitmapFont?: BitmapFont;
        audioBuffer?: AudioBuffer;
        sound?: THREE.Audio<any>;
        constructor();
        load(): Object;
        getBranch(): PackageItem;
        getHighResolution(): PackageItem;
        toString(): string;
    }

    export class PopupMenu {
        protected _contentPane: GComponent;
        protected _list: GList;
        constructor(resourceURL?: string);
        dispose(): void;
        addItem(caption: string, handler?: Function): GButton;
        addItemAt(caption: string, index: number, handler?: Function): GButton;
        addSeperator(): void;
        getItemName(index: number): string;
        setItemText(name: string, caption: string): void;
        setItemVisible(name: string, visible: boolean): void;
        setItemGrayed(name: string, grayed: boolean): void;
        setItemCheckable(name: string, checkable: boolean): void;
        setItemChecked(name: string, checked: boolean): void;
        isItemChecked(name: string): boolean;
        removeItem(name: string): boolean;
        clearItems(): void;
        readonly itemCount: number;
        readonly contentPane: GComponent;
        readonly list: GList;
        show(target?: GObject, dir?: PopupDirection): void;
        private __clickItem;
        private __addedToStage;
    }

    export class RelationItem {
        private _owner;
        private _target;
        private _defs;
        private _targetX;
        private _targetY;
        private _targetWidth;
        private _targetHeight;
        constructor(owner: GObject);
        readonly owner: GObject;
        target: GObject;
        add(relationType: number, usePercent: boolean): void;
        internalAdd(relationType: number, usePercent: boolean): void;
        remove(relationType: number): void;
        copy(source: RelationItem): void;
        dispose(): void;
        readonly isEmpty: boolean;
        applyOnSelfResized(dWidth: number, dHeight: number, applyPivot: boolean): void;
        private applyOnXYChanged;
        private applyOnSizeChanged;
        private addRefTarget;
        private releaseRefTarget;
        private __targetXYChanged;
        private __targetSizeChanged;
    }

    export class Relations {
        private _owner;
        private _items;
        handling: GObject;
        constructor(owner: GObject);
        add(target: GObject, relationType: number, usePercent?: boolean): void;
        remove(target: GObject, relationType?: number): void;
        contains(target: GObject): boolean;
        clearFor(target: GObject): void;
        clearAll(): void;
        copyFrom(source: Relations): void;
        dispose(): void;
        onOwnerSizeChanged(dWidth: number, dHeight: number, applyPivot: boolean): void;
        readonly empty: boolean;
        setup(buffer: ByteBuffer, parentToChild: boolean): void;
    }

    export class ScrollPane {
        static draggingPane: ScrollPane;
        private _owner;
        private _container;
        private _maskContainer;
        private _scrollType;
        private _scrollStep;
        private _decelerationRate;
        private _scrollBarMargin;
        private _bouncebackEffect;
        private _touchEffect;
        private _scrollBarDisplayAuto?;
        private _vScrollNone;
        private _hScrollNone;
        private _needRefresh;
        private _refreshBarAxis;
        private _displayOnLeft?;
        private _snapToItem?;
        _displayInDemand?: boolean;
        private _mouseWheelEnabled;
        private _pageMode?;
        private _inertiaDisabled?;
        private _floating?;
        private _dontClipMargin?;
        private _xPos;
        private _yPos;
        private _viewSize;
        private _contentSize;
        private _overlapSize;
        private _pageSize;
        private _containerPos;
        private _beginTouchPos;
        private _lastTouchPos;
        private _lastTouchGlobalPos;
        private _velocity;
        private _velocityScale;
        private _lastMoveTime;
        private _isHoldAreaDone;
        private _aniFlag;
        _loop: number;
        private _headerLockedSize;
        private _footerLockedSize;
        private _refreshEventDispatching;
        private _dragged;
        private _tweening;
        private _tweenTime;
        private _tweenDuration;
        private _tweenStart;
        private _tweenChange;
        private _pageController?;
        private _hzScrollBar?;
        private _vtScrollBar?;
        private _header?;
        private _footer?;
        constructor(owner: GComponent);
        setup(buffer: ByteBuffer): void;
        dispose(): void;
        owner: GComponent;
        hzScrollBar: GScrollBar;
        vtScrollBar: GScrollBar;
        header: GComponent;
        footer: GComponent;
        bouncebackEffect: boolean;

        touchEffect: boolean;


        scrollStep: number;
        snapToItem: boolean;

        mouseWheelEnabled: boolean;

        decelerationRate: number;

        readonly isDragged: boolean;
        percX: number;

        setPercX(value: number, ani?: boolean): void;
        percY: number;

        setPercY(value: number, ani?: boolean): void;
        posX: number;

        setPosX(value: number, ani?: boolean): void;
        posY: number;

        setPosY(value: number, ani?: boolean): void;
        readonly contentWidth: number;
        readonly contentHeight: number;
        viewWidth: number;

        viewHeight: number;

        currentPageX: number;

        currentPageY: number;

        setCurrentPageX(value: number, ani?: boolean): void;
        setCurrentPageY(value: number, ani?: boolean): void;
        readonly isBottomMost: boolean;
        readonly isRightMost: boolean;
        pageController: Controller;
        readonly scrollingPosX: number;
        readonly scrollingPosY: number;
        scrollTop(ani?: boolean): void;
        scrollBottom(ani?: boolean): void;
        scrollUp(ratio?: number, ani?: boolean): void;
        scrollDown(ratio?: number, ani?: boolean): void;
        scrollLeft(ratio?: number, ani?: boolean): void;
        scrollRight(ratio?: number, ani?: boolean): void;
        scrollToView(target: GObject | Rect, ani?: boolean, setFirst?: boolean): void;
        isChildInView(obj: GObject): boolean;
        cancelDragging(): void;
        lockHeader(size: number): void;
        lockFooter(size: number): void;
        onOwnerSizeChanged(): void;
        handleControllerChanged(c: Controller): void;
        private updatePageController;
        adjustMaskContainer(): void;
        setSize(aWidth: number, aHeight: number): void;
        setContentSize(aWidth: number, aHeight: number): void;
        changeContentSizeOnScrolling(deltaWidth: number, deltaHeight: number, deltaPosX: number, deltaPosY: number): void;
        private handleSizeChanged;
        private posChanged;
        private refresh;
        private refresh2;
        private __touchBegin;
        private __touchMove;
        private __touchEnd;
        private __mouseWheel;
        private updateScrollBarPos;
        updateScrollBarVisible(): void;
        private updateScrollBarVisible2;
        private __barTweenComplete;
        private getLoopPartSize;
        private loopCheckingCurrent;
        private loopCheckingTarget;
        private loopCheckingTarget2;
        private loopCheckingNewPos;
        private alignPosition;
        private alignByPage;
        private updateTargetAndDuration;
        private updateTargetAndDuration2;
        private fixDuration;
        private startTween;
        private killTween;
        private checkRefreshBar;
        private tweenUpdate;
        private runTween;
    }

    export class Transition {
        name: string;
        private _owner;
        private _ownerBaseX;
        private _ownerBaseY;
        private _items;
        private _totalTimes;
        private _totalTasks;
        private _playing;
        private _paused;
        private _onComplete;
        private _options;
        private _reversed;
        private _totalDuration;
        private _autoPlay;
        private _autoPlayTimes;
        private _autoPlayDelay;
        private _timeScale;
        private _startTime;
        private _endTime;
        constructor(owner: GComponent);
        play(onComplete?: Function, times?: number, delay?: number, startTime?: number, endTime?: number): void;
        playReverse(onComplete?: Function, times?: number, delay?: number, startTime?: number, endTime?: number): void;
        changePlayTimes(value: number): void;
        setAutoPlay(value: boolean, times?: number, delay?: number): void;
        private _play;
        stop(setToComplete?: boolean, processCallback?: boolean): void;
        private stopItem;
        setPaused(paused: boolean): void;
        dispose(): void;
        playing: boolean;
        setValue(label: string, ...args: any[]): void;
        setHook(label: string, callback: Function): void;
        clearHooks(): void;
        setTarget(label: string, newTarget: GObject): void;
        setDuration(label: string, value: number): void;
        getLabelTime(label: string): number;
        timeScale: number;
        updateFromRelations(targetId: string, dx: number, dy: number): void;
        onOwnerAddedToStage(): void;
        onOwnerRemovedFromStage(): void;
        private onDelayedPlay;
        private internalPlay;
        private playItem;
        private skipAnimations;
        private onDelayedPlayItem;
        private onTweenStart;
        private onTweenUpdate;
        private onTweenComplete;
        private onPlayTransCompleted;
        private callHook;
        private checkAllComplete;
        private applyValue;
        setup(buffer: ByteBuffer): void;
        private decodeValue;
    }

    export class TranslationHelper {
        static strings: {
            [index: string]: {
                [index: string]: string;
            };
        };
        constructor();
        static loadFromXML(source: XML): void;
        static translateComponent(item: PackageItem): void;
    }

    export class UIConfig {
        static defaultFont: string;
        static windowModalWaiting: string;
        static globalModalWaiting: string;
        static modalLayerColor: Color4;
        static buttonSound: string;
        static buttonSoundVolumeScale: number;
        static horizontalScrollBar: string;
        static verticalScrollBar: string;
        static defaultScrollStep: number;
        static defaultScrollDecelerationRate: number;
        static defaultScrollBarDisplay: number;
        static defaultScrollTouchEffect: boolean;
        static defaultScrollBounceEffect: boolean;
        /**
        * 当滚动容器设置为“贴近ITEM”时，判定贴近到哪一个ITEM的滚动距离阀值。
        */
        static defaultScrollSnappingThreshold: number;
        /**
        * 当滚动容器设置为“页面模式”时，判定翻到哪一页的滚动距离阀值。
        */
        static defaultScrollPagingThreshold: number;
        static popupMenu: string;
        static popupMenu_seperator: string;
        static loaderErrorSign: string;
        static tooltipsWin: string;
        static defaultComboBoxVisibleItemCount: number;
        static touchScrollSensitivity: number;
        static touchDragSensitivity: number;
        static clickDragSensitivity: number;
        static bringWindowToFrontOnClick: boolean;
        static frameTimeForAsyncUIConstruction: number;
        static packageFileExtension: string;
    }

    export enum ScaleMode {
        ConstantPixelSize = 0,
        ScaleWithScreenSize = 1,
        ConstantPhysicalSize = 2
    }
    export enum ScreenMatchMode {
        MatchWidthOrHeight = 0,
        MatchWidth = 1,
        MatchHeight = 2
    }
    export class UIContentScaler {
        static readonly scaleFactor: number;
        static readonly scaleLevel: number;
        static scaleWithScreenSize(designResolutionX: number, designResolutionY: number, screenMatchMode?: ScreenMatchMode): void;
        static setConstant(constantScaleFactor?: number): void;
    }

    export class UIObjectFactory {
        static extensions: {
            [index: string]: new () => GComponent;
        };
        static loaderType: new () => GLoader;
        static setExtension(url: string, type: new () => GComponent): void;
        static setLoaderExtension(type: new () => GLoader): void;
        static resolveExtension(pi: PackageItem): void;
        static newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
    }

    export class UIPackage {
        private _id;
        private _name;
        private _items;
        private _itemsById;
        private _itemsByName;
        private _resKey;
        private _customId;
        private _sprites;
        private _dependencies;
        private _branches;
        _branchIndex: number;
        constructor();
        static readonly branch: string;

        static getVar(key: string): string;
        static setVar(key: string, value: string): void;
        static getById(id: string): UIPackage;
        static getByName(name: string): UIPackage;
        static loadPackage(resKey: string, onProgress?: (event: ProgressEvent) => void): Promise<UIPackage>;
        static removePackage(packageIdOrName: string): void;
        static createObject(pkgName: string, resName: string, userClass?: new () => GObject): GObject;
        static createObjectFromURL(url: string, userClass?: new () => GObject): GObject;
        static getItemURL(pkgName: string, resName: string): string;
        static getItemByURL(url: string): PackageItem;
        static getItemAssetByURL(url: string): any;
        static normalizeURL(url: string): string;
        private loadPackage;
        dispose(): void;
        readonly id: string;
        readonly name: string;
        customId: string;

        createObject(resName: string, userClass?: new () => GObject): GObject;
        internalCreateObject(item: PackageItem, userClass?: new () => GObject): GObject;
        getItemById(itemId: string): PackageItem;
        getItemByName(resName: string): PackageItem;
        getItemAssetByName(resName: string): Object;
        getItemAsset(item: PackageItem): Object;
        private loadMovieClip;
        private loadFont;
    }
    export interface IObjectFactoryType {
        resolveExtension(pi: PackageItem): void;
        newObject(type: number | PackageItem, userClass?: new () => GObject): GObject;
    }
    export type Decls = {
        UIObjectFactory?: IObjectFactoryType;
    };

    export interface IUISource {
        fileName: string;
        loaded: boolean;
        load(callback: Function, target: any): void;
    }
    export class Window extends GComponent {
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

        contentPane: GComponent;
        readonly frame: GComponent;
        closeButton: GObject;

        dragArea: GObject;
        contentArea: GObject;

        show(): void;
        showOn(root: GRoot): void;
        hide(): void;
        hideImmediately(): void;
        centerOn(r: GRoot, restraint?: boolean): void;
        toggleStatus(): void;
        readonly isShowing: boolean;
        readonly isTop: boolean;
        modal: boolean;

        bringToFront(): void;
        showModalWait(requestingCmd?: number): void;
        protected layoutModalWaitPane(): void;
        closeModalWait(requestingCmd?: number): boolean;
        readonly modalWaiting: boolean;
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

    export class ByteBuffer {
        stringTable: Array<string>;
        version: number;
        littleEndian?: boolean;
        protected _buffer: ArrayBuffer;
        protected _view: DataView;
        protected _pos: number;
        protected _length: number;
        constructor(buffer: ArrayBuffer, offset?: number, length?: number);
        readonly data: ArrayBuffer;
        pos: number;
        readonly length: number;
        skip(count: number): void;
        private validate;
        readByte(): number;
        readBool(): boolean;
        readShort(): number;
        readUshort(): number;
        readInt(): number;
        readUint(): number;
        readFloat(): number;
        readString(len?: number): string;
        readS(): string;
        readSArray(cnt: number): Array<string>;
        writeS(value: string): void;
        readColor(): number;
        readFullColor(): Color4;
        readChar(): string;
        readBuffer(): ByteBuffer;
        seek(indexTablePos: number, blockIndex: number): boolean;
    }

    export class Color4 extends THREE.Color {
        a: number;
        constructor(rgb?: number, a?: number);
    }

    export class ColorMatrix {
        matrix: Array<number>;
        static create(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): ColorMatrix;
        static getMatrix(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number, result?: number[]): number[];
        constructor();
        reset(): void;
        invert(): void;
        adjustColor(p_brightness: number, p_contrast: number, p_saturation: number, p_hue: number): void;
        adjustBrightness(p_val: number): void;
        adjustContrast(p_val: number): void;
        adjustSaturation(p_val: number): void;
        adjustHue(p_val: number): void;
        concat(p_matrix: Array<number>): void;
        clone(): ColorMatrix;
        protected copyMatrix(p_matrix: Array<number>): void;
        protected multiplyMatrix(p_matrix: Array<number>): void;
        protected cleanValue(p_val: number, p_limit: number): number;
    }

    export enum HtmlElementType {
        Text = 0,
        Link = 1,
        Image = 2,
        Input = 3,
        Select = 4,
        Object = 5,
        LinkEnd = 6
    }
    export class HtmlElement {
        type: HtmlElementType;
        name: string;
        text: string;
        format: TextFormat;
        charIndex: number;
        htmlObject: IHtmlObject;
        status: number;
        space: number;
        position: THREE.Vector2;
        _attributes: {
            [index: string]: any;
        };
        constructor();
        getAttr(attrName: string): any;
        setAttr(attrName: string, attrValue: any): void;
        getAttrString(attrName: string, defValue?: string): string;
        getAttrInt(attrName: string, defValue?: number): number;
        getAttrFloat(attrName: string, defValue?: number): number;
        getAttrBool(attrName: string, defValue?: boolean): boolean;
        getAttrColor(attrName: string, defValue?: number): number;
        fetchAttributes(): void;
        readonly isEntity: boolean;
        reset(): void;
    }
    export var elementPool: Pool<HtmlElement>;

    export class HtmlImage implements IHtmlObject {
        readonly loader: GLoader;
        private _owner;
        private _element;
        constructor();
        readonly displayObject: DisplayObject;
        readonly element: HtmlElement;
        readonly width: number;
        readonly height: number;
        create(owner: RichTextField, element: HtmlElement): void;
        setPosition(x: number, y: number): void;
        add(): void;
        remove(): void;
        release(): void;
        dispose(): void;
    }

    export class HtmlLink implements IHtmlObject {
        private _owner;
        private _element;
        private _shape;
        constructor();
        readonly displayObject: DisplayObject;
        readonly element: HtmlElement;
        readonly width: number;
        readonly height: number;
        create(owner: RichTextField, element: HtmlElement): void;
        setArea(startLine: number, startCharX: number, endLine: number, endCharX: number): void;
        setPosition(x: number, y: number): void;
        add(): void;
        remove(): void;
        release(): void;
        dispose(): void;
    }

    export class HtmlPageContext implements IHtmlPageContext {
        private _imagePool;
        private _linkPool;
        constructor();
        createObject(owner: RichTextField, element: HtmlElement): IHtmlObject;
        freeObject(obj: IHtmlObject): void;
    }
    export var defaultContext: IHtmlPageContext;

    export class HtmlParseOptions {
        linkUnderline: boolean;
        linkColor: number;
        ignoreWhiteSpace: boolean;
        static defaultLinkUnderline: boolean;
        static defaultLinkColor: number;
        constructor();
    }

    export class HtmlParser {
        protected _textFormatStack: Array<TextFormat>;
        protected _textFormatStackTop: number;
        protected _format: TextFormat;
        protected _elements: Array<HtmlElement>;
        protected _defaultOptions: HtmlParseOptions;
        constructor();
        parse(aSource: string, defaultFormat: TextFormat, elements: Array<HtmlElement>, parseOptions: HtmlParseOptions): void;
        protected pushTextFormat(): void;
        protected popTextFormat(): void;
        protected isNewLine(): boolean;
        protected appendText(text: string): void;
    }

    export interface IHtmlObject {
        width: number;
        height: number;
        displayObject: DisplayObject;
        element: HtmlElement;
        create(owner: RichTextField, element: HtmlElement): void;
        setPosition(x: number, y: number): void;
        add(): void;
        remove(): void;
        release(): void;
        dispose(): void;
    }

    export interface IHtmlPageContext {
        createObject(owner: RichTextField, element: HtmlElement): IHtmlObject;
        freeObject(obj: IHtmlObject): void;
    }

    export class Pool<T extends Object> {
        pool: any[];
        _init: (arg0: T, ...argArray: any[]) => void;
        _reset: (arg0: T) => void;
        _ct: new () => T;
        constructor(type: new () => T, init?: (arg0: T) => void, reset?: (arg0: T) => void);
        borrow(...argArray: any[]): T;
        returns(element: T | Array<T>): void;
    }

    export class Rect {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        set(x: number, y: number, width: number, height: number): void;
        setMinMax(xMin: number, yMin: number, xMax: number, yMax: number): void;
        readonly position: THREE.Vector2;
        readonly size: THREE.Vector2;
        xMin: number;

        xMax: number;

        yMin: number;

        yMax: number;

        intersection(another: Rect): Rect;
        union(another: Rect): Rect;
        extend(x: number, y: number): void;
        contains(x: number | THREE.Vector2, y?: number): boolean;
        copy(source: Rect): void;
        clone(): Rect;
    }

    export class Timers {
        static deltaTime: number;
        static time: number;
        static frameCount: number;
        static add(delayInMiniseconds: number, repeat: number, callback: Function, target?: any, callbackParam?: any): void;
        static callLater(callback: Function, target?: any, callbackParam?: any): void;
        static callDelay(delay: number, callback: Function, target?: any, callbackParam?: any): void;
        static addUpdate(callback: Function, target?: any, callbackParam?: any): void;
        static exists(callback: Function, target?: any): boolean;
        static remove(callback: Function, target?: any): void;
    }

    export function convertToHtmlColor(argb: number, hasAlpha?: boolean): string;
    export function convertFromHtmlColor(str: string, hasAlpha?: boolean): number;
    export function clamp(value: number, min: number, max: number): number;
    export function clamp01(value: number): number;
    export function lerp(start: number, end: number, percent: number): number;
    export function repeat(t: number, length: number): number;
    export function distance(x1: number, y1: number, x2: number, y2: number): number;

    export class UBBParser {
        private _text;
        private _readPos;
        protected _handlers: {
            [index: string]: (tagName: string, end: boolean, attr: string) => string;
        };
        defaultImgWidth: number;
        defaultImgHeight: number;
        lastColor: string;
        lastSize: string;
        constructor();
        protected onTag_URL(tagName: string, end: boolean, attr: string): string;
        protected onTag_IMG(tagName: string, end: boolean, attr: string): string;
        protected onTag_B(tagName: string, end: boolean, attr: string): string;
        protected onTag_I(tagName: string, end: boolean, attr: string): string;
        protected onTag_U(tagName: string, end: boolean, attr: string): string;
        protected onTag_Simple(tagName: string, end: boolean, attr: string): string;
        protected onTag_COLOR(tagName: string, end: boolean, attr: string): string;
        protected onTag_FONT(tagName: string, end: boolean, attr: string): string;
        protected onTag_SIZE(tagName: string, end: boolean, attr: string): string;
        protected getTagText(remove?: boolean): string;
        parse(text: string, remove?: boolean): string;
    }
    export var defaultParser: HtmlParser | UBBParser;

    export class XML {
        name: string;
        text: string;
        private _attributes;
        private _children;
        constructor(XmlString?: string);
        readonly attributes: {
            [index: string]: string;
        };
        getAttrString(attrName: string, defValue?: string): string;
        getAttrInt(attrName: string, defValue?: number): number;
        getAttrFloat(attrName: string, defValue?: number): number;
        getAttrBool(attrName: string, defValue?: boolean): boolean;
        getAttrColor(attrName: string, defValue?: number): number;
        setAttribute(attrName: string, attrValue: string): void;
        getNode(selector: string): XML;
        elements(selector?: string): Array<XML>;
        parse(aSource: string): void;
        reset(): void;
    }

    export enum XMLTagType {
        Start = 0,
        End = 1,
        Void = 2,
        CDATA = 3,
        Comment = 4,
        Instruction = 5
    }
    export class XMLIterator {
        static tagName: string;
        static tagType: XMLTagType;
        static lastTagName: string;
        static source: string;
        static sourceLen: number;
        static parsePos: number;
        static tagPos: number;
        static tagLength: number;
        static lastTagEnd: number;
        static attrParsed: boolean;
        static lowerCaseName: boolean;
        static attributes: any;
        static begin(source: string, lowerCaseName?: boolean): void;
        static nextTag(): boolean;
        static getTagSource(): string;
        static getRawText(trim?: boolean): string;
        static getText(trim?: boolean): string;
        static getAttribute(attrName: string): string;
        static getAttributes(result: any): any;
        static parseAttributes(attrs: any): void;
    }

    export class XMLUtils {
        static decodeString(aSource: string): string;
        static encodeString(str: string): string;
        static getString(attrs: any, attrName: string, defValue?: string): string;
        static getInt(attrs: any, attrName: string, defValue?: number): number;
        static getFloat(attrs: any, attrName: string, defValue?: number): number;
        static getBool(attrs: any, attrName: string, defValue?: boolean): boolean;
        static getColor(attrs: any, attrName: string, defValue?: number): number;
    }
}