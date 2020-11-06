import { Rect } from "../utils/Rect";
import { Vector2 } from "three";
export class NTexture {
    constructor(texture, xScale, yScale) {
        xScale = xScale || 1;
        yScale = yScale || 1;
        this._nativeTexture = texture;
        this._root = this;
        this.uvRect = new Rect(0, 0, xScale, yScale);
        if (yScale < 0) {
            this.uvRect.y = -yScale;
            this.uvRect.height = yScale;
        }
        if (xScale < 0) {
            this.uvRect.x = -xScale;
            this.uvRect.width = xScale;
        }
        this.originalSize = texture ? new Vector2(texture.image.width, texture.image.height) : new Vector2(2, 2);
        this.region = new Rect(0, 0, this.originalSize.x, this.originalSize.y);
        this.offset = new Vector2(0, 0);
    }
    createSubTexture(region, rotated, offset, originalSize) {
        let nt = new NTexture();
        nt._root = this;
        nt.rotated = rotated || false;
        nt.region.copy(region);
        nt.region.x += this.region.x;
        nt.region.y += this.region.y;
        nt.uvRect.set(nt.region.x * this.uvRect.width / this.width, 1 - nt.region.yMax * this.uvRect.height / this.height, nt.region.width * this.uvRect.width / this.width, nt.region.height * this.uvRect.height / this.height);
        if (rotated) {
            let tmp = nt.region.width;
            nt.region.width = nt.region.height;
            nt.region.height = tmp;
            tmp = nt.uvRect.width;
            nt.uvRect.width = nt.uvRect.height;
            nt.uvRect.height = tmp;
        }
        if (originalSize)
            nt.originalSize.copy(originalSize);
        else
            nt.originalSize.set(nt.region.width, nt.region.height);
        if (offset)
            nt.offset.copy(offset);
        return nt;
    }
    get width() {
        return this.region.width;
    }
    get height() {
        return this.region.height;
    }
    get nativeTexture() {
        return this._root == this ? this._nativeTexture : this._root.nativeTexture;
    }
    getDrawRect(drawRect) {
        if (this.originalSize.x == this.region.width && this.originalSize.y == this.region.height)
            return drawRect;
        let sx = drawRect.width / this.originalSize.x;
        let sy = drawRect.height / this.originalSize.y;
        drawRect.x = this.offset.x * sx;
        drawRect.y = this.offset.y * sy;
        drawRect.width = this.region.width * sx;
        drawRect.height = this.region.height * sy;
        return drawRect;
    }
    getUV(uv) {
        uv[0] = this.uvRect.position;
        uv[1] = new Vector2(this.uvRect.x, this.uvRect.yMax);
        uv[2] = new Vector2(this.uvRect.xMax, this.uvRect.yMax);
        uv[3] = new Vector2(this.uvRect.xMax, this.uvRect.y);
        if (this.rotated) {
            let xMin = this.uvRect.xMin;
            let yMin = this.uvRect.yMin;
            let yMax = this.uvRect.yMax;
            for (let i = 0; i < 4; i++) {
                let m = uv[i];
                let tmp = m.y;
                m.y = yMin + m.x - xMin;
                m.x = xMin + yMax - tmp;
            }
        }
    }
    get root() {
        return this._root;
    }
    reload(nativeTexture) {
        if (this._root != this)
            throw new Error("Reload is not allow to call on none root NTexture.");
        if (this._nativeTexture && this._nativeTexture != nativeTexture)
            this._nativeTexture.dispose();
        this._nativeTexture = nativeTexture;
        if (this._nativeTexture)
            this.originalSize.set(nativeTexture.image.width, nativeTexture.image.height);
        else
            this.originalSize.set(0, 0);
        this.region.set(0, 0, this.originalSize.x, this.originalSize.y);
    }
    dispose() {
        if (this._root == this)
            this._nativeTexture.dispose();
    }
}
export const EmptyTexture = new NTexture();
