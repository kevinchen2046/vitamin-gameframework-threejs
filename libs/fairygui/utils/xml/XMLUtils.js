import { convertFromHtmlColor } from "../ToolSet";
export class XMLUtils {
    static decodeString(aSource) {
        let len = aSource.length;
        let sb = "";
        let pos1 = 0, pos2 = 0;
        while (true) {
            pos2 = aSource.indexOf('&', pos1);
            if (pos2 == -1) {
                sb += aSource.substr(pos1);
                break;
            }
            sb += aSource.substr(pos1, pos2 - pos1);
            pos1 = pos2 + 1;
            pos2 = pos1;
            let end = Math.min(len, pos2 + 10);
            for (; pos2 < end; pos2++) {
                if (aSource[pos2] == ';')
                    break;
            }
            if (pos2 < end && pos2 > pos1) {
                let entity = aSource.substr(pos1, pos2 - pos1);
                let u = 0;
                if (entity[0] == '#') {
                    if (entity.length > 1) {
                        if (entity[1] == 'x')
                            u = parseInt(entity.substr(2), 16);
                        else
                            u = parseInt(entity.substr(1));
                        sb += String.fromCharCode(u);
                        pos1 = pos2 + 1;
                    }
                    else
                        sb += '&';
                }
                else {
                    switch (entity) {
                        case "amp":
                            u = 38;
                            break;
                        case "apos":
                            u = 39;
                            break;
                        case "gt":
                            u = 62;
                            break;
                        case "lt":
                            u = 60;
                            break;
                        case "nbsp":
                            u = 32;
                            break;
                        case "quot":
                            u = 34;
                            break;
                    }
                    if (u > 0) {
                        sb += String.fromCharCode(u);
                        pos1 = pos2 + 1;
                    }
                    else
                        sb += '&';
                }
            }
            else {
                sb += '&';
            }
        }
        return sb;
    }
    static encodeString(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
    }
    static getString(attrs, attrName, defValue) {
        if (attrs == null)
            return defValue == null ? null : defValue;
        let ret = attrs[attrName];
        if (ret != null)
            return "" + ret;
        else
            return defValue == null ? null : defValue;
    }
    static getInt(attrs, attrName, defValue) {
        let value = this.getString(attrs, attrName);
        if (value == null || value.length == 0)
            return defValue == null ? 0 : defValue;
        if (value[value.length - 1] == '%') {
            let ret = parseInt(value.substring(0, value.length - 1));
            return Math.ceil(ret / 100.0 * defValue);
        }
        else
            return parseInt(value);
    }
    static getFloat(attrs, attrName, defValue) {
        let value = this.getString(attrs, attrName);
        if (value == null || value.length == 0)
            return defValue == null ? 0 : defValue;
        let ret = parseFloat(value);
        if (isNaN(ret))
            return defValue == null ? 0 : defValue;
        else
            return ret;
    }
    static getBool(attrs, attrName, defValue) {
        let value = this.getString(attrs, attrName);
        if (value == null || value.length == 0)
            return defValue == null ? false : defValue;
        if (value == "true" || value == "1")
            return true;
        else if (value == "false" || value == "0")
            return false;
        else
            return defValue == null ? false : defValue;
    }
    static getColor(attrs, attrName, defValue) {
        let value = this.getString(attrs, attrName);
        if (value == null || value.length == 0)
            return defValue == null ? 0 : defValue;
        return convertFromHtmlColor(value);
    }
}
const ESCAPES = [
    "&", "&amp;",
    "<", "&lt;",
    ">", "&gt;",
    "'", "&apos;",
    "\"", "&quot;"
];
