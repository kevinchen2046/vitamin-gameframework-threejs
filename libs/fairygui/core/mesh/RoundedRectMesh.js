import { Color4 } from "../../utils/Color";
export class RoundedRectMesh {
    constructor() {
        this.topLeftRadius = 0;
        this.topRightRadius = 0;
        this.bottomLeftRadius = 0;
        this.bottomRightRadius = 0;
        this.lineWidth = 1;
        this.lineColor = new Color4();
    }
    onPopulateMesh(vb) {
        let rect = this.drawRect ? this.drawRect : vb.contentRect;
        let color = this.fillColor ? this.fillColor : vb.vertexColor;
        let lineColor = this.lineColor;
        let radiusX = rect.width / 2;
        let radiusY = rect.height / 2;
        let cornerMaxRadius = Math.min(radiusX, radiusY);
        let centerX = radiusX + rect.x;
        let centerY = radiusY + rect.y;
        vb.addVert(centerX, centerY, 0, color);
        let cnt = vb.currentVertCount;
        for (let i = 0; i < 4; i++) {
            let radius = 0;
            switch (i) {
                case 0:
                    radius = this.bottomRightRadius;
                    break;
                case 1:
                    radius = this.bottomLeftRadius;
                    break;
                case 2:
                    radius = this.topLeftRadius;
                    break;
                case 3:
                    radius = this.topRightRadius;
                    break;
            }
            radius = Math.min(cornerMaxRadius, radius);
            let offsetX = rect.x;
            let offsetY = rect.y;
            if (i == 0 || i == 3)
                offsetX = rect.xMax - radius * 2;
            if (i == 0 || i == 1)
                offsetY = rect.yMax - radius * 2;
            if (radius != 0) {
                let partNumSides = Math.max(1, Math.ceil(Math.PI * radius / 8)) + 1;
                let angleDelta = Math.PI / 2 / partNumSides;
                let angle = Math.PI / 2 * i;
                let startAngle = angle;
                for (let j = 1; j <= partNumSides; j++) {
                    if (j == partNumSides) //消除精度误差带来的不对齐
                        angle = startAngle + Math.PI / 2;
                    let vx = offsetX + Math.cos(angle) * (radius - this.lineWidth) + radius;
                    let vy = offsetY + Math.sin(angle) * (radius - this.lineWidth) + radius;
                    vb.addVert(vx, vy, 0, color);
                    if (this.lineWidth != 0) {
                        vb.addVert(vx, vy, 0, lineColor);
                        vb.addVert(offsetX + Math.cos(angle) * radius + radius, offsetY + Math.sin(angle) * radius + radius, 0, lineColor);
                    }
                    angle += angleDelta;
                }
            }
            else {
                let vx = offsetX;
                let vy = offsetY;
                if (this.lineWidth != 0) {
                    if (i == 0 || i == 3)
                        offsetX -= this.lineWidth;
                    else
                        offsetX += this.lineWidth;
                    if (i == 0 || i == 1)
                        offsetY -= this.lineWidth;
                    else
                        offsetY += this.lineWidth;
                    vb.addVert(offsetX, offsetY, 0, color);
                    vb.addVert(offsetX, offsetY, 0, lineColor);
                    vb.addVert(vx, vy, 0, lineColor);
                }
                else
                    vb.addVert(vx, vy, 0, color);
            }
        }
        cnt = vb.currentVertCount - cnt;
        if (this.lineWidth > 0) {
            for (let i = 0; i < cnt; i += 3) {
                if (i != cnt - 3) {
                    vb.addTriangle(0, i + 4, i + 1);
                    vb.addTriangle(i + 5, i + 3, i + 2);
                    vb.addTriangle(i + 3, i + 5, i + 6);
                }
                else {
                    vb.addTriangle(0, 1, i + 1);
                    vb.addTriangle(2, i + 3, i + 2);
                    vb.addTriangle(i + 3, 2, 3);
                }
            }
        }
        else {
            for (let i = 0; i < cnt; i++)
                vb.addTriangle(0, (i == cnt - 1) ? 1 : i + 2, i + 1);
        }
    }
    hitTest(contentRect, x, y) {
        if (this.drawRect)
            return this.drawRect.contains(x, y);
        else
            return contentRect.contains(x, y);
    }
}
