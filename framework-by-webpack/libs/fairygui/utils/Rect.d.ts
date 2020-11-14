import { Vector2 } from "three";
export declare class Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    set(x: number, y: number, width: number, height: number): void;
    setMinMax(xMin: number, yMin: number, xMax: number, yMax: number): void;
    get position(): Vector2;
    get size(): Vector2;
    get xMin(): number;
    set xMin(value: number);
    get xMax(): number;
    set xMax(value: number);
    get yMin(): number;
    set yMin(value: number);
    get yMax(): number;
    set yMax(value: number);
    intersection(another: Rect): Rect;
    union(another: Rect): Rect;
    extend(x: number, y: number): void;
    contains(x: number | Vector2, y?: number): boolean;
    copy(source: Rect): void;
    clone(): Rect;
}
