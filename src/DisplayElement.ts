// TypeScript file


class TextField extends DisplayObject {

    text = "";
    color = "#000000";
    font = "15px Arial";
    

    render(context: CanvasRenderingContext2D) {

        //透明度
        context.globalAlpha = this.globalAlpha;
        //填充颜色
        context.fillStyle = this.color;
        //文本格式
        context.font = this.font;
        //绘制文本
        context.fillText(this.text, 0, 0);
    }

    /**
     * 判断是否点击到文字
     */
    hitTest(hitPoint: math.Point): DisplayObject {

        var rect = new math.Rectangle();
        rect.width = 10 * this.text.length;
        rect.height = 20;
        let invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
        let pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
        return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
    }
}

class Bitmap extends DisplayObject {

    /**
     * 图片路径
     */
    url = "";

    img = new Image();

    render(context: CanvasRenderingContext2D) {

        this.img.src = this.url;

        this.img.onload = () => {
            context.globalAlpha = this.globalAlpha;
            context.drawImage(this.img, 0, 0);
        }
    }

    /**
     * 判断是否点击倒图片
     */
    hitTest(hitPoint: math.Point): DisplayObject {

        var rect = new math.Rectangle();
        rect.width = this.img.width;
        rect.height = this.img.height;
        let invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
        let pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
        return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
    }
}