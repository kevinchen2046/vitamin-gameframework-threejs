import { TextField, GUTTER_X, GUTTER_Y } from "./TextField";
import { Color4 } from "../../utils/Color";
import { Rect } from "../../utils/Rect";
import { convertToHtmlColor } from "../../utils/ToolSet";
import { Stage } from "../Stage";
import { Vector2, Matrix4, Vector3 } from "three";
import { defaultParser } from "../../utils/UBBParser";
export class InputTextField extends TextField {
    constructor() {
        super();
        this._touchDisabled = false;
        this.opaque = true;
        this.isInput = true;
        this._text2 = '';
        this.maxLength = 0;
        this.editable = true;
        this._borderColor = new Color4();
        this._backgroundColor = new Color4(0xFFFFFF, 0);
        this.on("focus_in", this.__focusIn, this, true);
        this.on("focus_out", this.__focusOut, this, true);
        this.on("removed_from_stage", this.__removed, this);
    }
    get text() {
        if (this._editing)
            this._text2 = this._element.value;
        return this._text2;
    }
    set text(value) {
        this._text2 = value;
        this.updateText();
    }
    get promptText() {
        return this._promptText;
    }
    set promptText(value) {
        this._promptText = value;
        this._decodedPromptText = defaultParser.parse(value);
        this.updateText();
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    updateText() {
        if (this._editing)
            this._element.value = this._text2;
        else if (this._text2.length == 0 && this._promptText)
            super.htmlText = this._decodedPromptText;
        else if (this._password)
            super.text = "*".repeat(this._text2.length);
        else
            super.text = this._text2;
    }
    onSizeChanged() {
        super.onSizeChanged();
        if (!this._clipRect)
            this._clipRect = new Rect();
        this._clipRect.copy(this._contentRect);
        this._clipRect.x += GUTTER_X;
        this._clipRect.y += GUTTER_Y;
        this._clipRect.width -= GUTTER_X * 2;
        this._clipRect.height -= GUTTER_Y * 2;
    }
    applyFormat() {
        super.applyFormat();
        if (this._element)
            this.setFormat();
    }
    createElement() {
        let e;
        if (this.singleLine) {
            e = this._element = document.createElement("input");
        }
        else {
            e = this._element = document.createElement("textarea");
            e.style.resize = "none";
            e.style.overflow = "scroll";
        }
        e.id = 'InputText';
        e.style.outline = "none";
        e.style.borderWidth = "0px";
        e.style.padding = "0px";
        e.style.margin = "0px";
        e.style.position = "absolute";
        e.style.display = "none";
        e.style.background = 'transparent';
        e.style.transformOrigin = e.style["WebkitTransformOrigin"] = "0 0 0";
        Stage.domElement.parentNode.appendChild(e);
        e.onblur = () => { Stage.setFocus(null); };
        this.setFormat();
    }
    setFormat() {
        let e = this._element;
        e.style.font = this._textFormat.size + "px " + this._font.name;
        e.style.color = convertToHtmlColor(this._textFormat.color);
        e.style.webkitTextStroke = this._textFormat.outline + "px " + convertToHtmlColor(this._textFormat.outlineColor);
        e.style.textAlign = this._textFormat.align;
    }
    dispose() {
        super.dispose();
        if (this._element) {
            this._element.style.display = 'none';
            if (this._element.parentNode)
                this._element.parentNode.removeChild(this._element);
            this._element = null;
        }
    }
    __focusIn() {
        if (!this.editable || this._editing)
            return;
        if (!this._font)
            this.applyFormat();
        if (!this._element)
            this.createElement();
        let e = this._element;
        e.style.display = "inline-block";
        this.locateInputElement();
        e.value = this._text2;
        //e.maxLength = this.maxLength;
        e.focus();
        this._editing = true;
        this._graphics.material.visible = false;
        this.dispatchEvent("focus_in");
    }
    locateInputElement() {
        this.localToGlobal(0, 0, s_pos);
        this.localToGlobal(1, 1, s_scale);
        s_scale.sub(s_pos);
        s_mat.getInverse(Stage.canvasTransform);
        s_tmp.set(s_pos.x, s_pos.y, 0);
        s_tmp.applyMatrix4(s_mat);
        s_pos.set(s_tmp.x, s_tmp.y);
        let rot = 0;
        if (s_mat.elements[1] > 0)
            rot = 90;
        else if (s_mat.elements[1] < 0)
            rot = -90;
        let style = this._element.style;
        style.width = this.width.toFixed(2) + "px";
        style.height = this.height.toFixed(2) + "px";
        style.left = (s_pos.x + 2) + "px";
        style.top = s_pos.y + "px";
        style.transform = style.webkitTransform = "scale(" + s_scale.x.toFixed(3) + "," + s_scale.y.toFixed(3) + ") rotate(" + rot + "deg)";
    }
    __focusOut() {
        if (!this._editing)
            return;
        this._element.style.display = "none";
        this._element.blur();
        this._text2 = this._element.value;
        this._editing = false;
        this.updateText();
        this._graphics.material.visible = true;
        if (this.stage)
            this.dispatchEvent("focus_out");
    }
    __removed() {
        if (this._editing)
            Stage.setFocus(null);
    }
}
var s_pos = new Vector2();
var s_scale = new Vector2();
var s_mat = new Matrix4();
var s_tmp = new Vector3();
