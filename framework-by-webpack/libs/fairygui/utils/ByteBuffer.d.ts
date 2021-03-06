import { Color4 } from "./Color";
export declare class ByteBuffer {
    stringTable: Array<string>;
    version: number;
    littleEndian?: boolean;
    protected _buffer: ArrayBuffer;
    protected _view: DataView;
    protected _pos: number;
    protected _length: number;
    constructor(buffer: ArrayBuffer, offset?: number, length?: number);
    get data(): ArrayBuffer;
    get pos(): number;
    set pos(value: number);
    get length(): number;
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
