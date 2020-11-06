export declare enum XMLTagType {
    Start = 0,
    End = 1,
    Void = 2,
    CDATA = 3,
    Comment = 4,
    Instruction = 5
}
export declare class XMLIterator {
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
