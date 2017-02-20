
window.onload = () => {

    var c = document.getElementById("myCanvas") as HTMLCanvasElement;
    var cxt = c.getContext("2d");

    var stage = new DisplayObjectContainer();

    var text = new TextField();
    text.text = "Hello World!!!!"
    text.x = 20;
    text.y = 20;
    text.color = "#00FF00"
    text.ScaleX = 3;
    text.rotation = 60;

    var bitmap = new Bitmap();
    bitmap.url = "huli.jpg";
    bitmap.x = 50;
    bitmap.y = 50;
    bitmap.alpha = 0.5;
    bitmap.rotation = 30;

    stage.addChild(text);
    stage.addChild(bitmap);

    stage.draw(cxt);

    setInterval(() => {
        text.x += 10;
        bitmap.x += 10;
        cxt.setTransform(1, 0, 0, 1, 0, 0);
        cxt.clearRect(0, 0, 800, 800);
        stage.draw(cxt);
    }, 500)
};

interface Drawable {

    draw(context: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable {

    //父级容器
    parent: DisplayObjectContainer;

    //本地坐标
    x = 0;
    y = 0;

    //透明度
    protected globalAlpha = 1;
    alpha = 1;

    ScaleX = 1;
    ScaleY = 1;
    Scale = 1;

    /**
     *旋转(角度制)
     */
    rotation = 0;

    //变换矩阵
    protected globalMatrix: math.Matrix;
    protected localMatrix: math.Matrix;

    /**
     * 调用所有子容器的render方法
     */
    draw(context: CanvasRenderingContext2D) {

        if (this.analysisMatrix(context)) {

            if (!this.parent) {
                this.globalAlpha = this.alpha;
            } else {
                this.globalAlpha = this.alpha * this.parent.globalAlpha;
            }
            this.render(context);
        } else {
            console.log("container wrong!");
            return;
        }
    }

    /**
     * 子类覆写render方法
     */
    protected render(context: CanvasRenderingContext2D) {

    }

    /**
     * 初始化全局矩阵和本地矩阵,成功则返回true
     */
    protected analysisMatrix(context: CanvasRenderingContext2D): boolean {

        this.localMatrix = new math.Matrix();
        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.ScaleX, this.ScaleY, this.rotation);

        if (!this.parent) {
            this.globalMatrix = this.localMatrix;
        } else {
            this.globalMatrix = math.matrixAppendMatrix(this.parent.globalMatrix, this.localMatrix);
        }

        let a = this.globalMatrix.a;
        let b = this.globalMatrix.b;
        let c = this.globalMatrix.c;
        let d = this.globalMatrix.d;
        let tx = this.globalMatrix.tx;
        let ty = this.globalMatrix.ty;

        context.setTransform(a, b, c, d, tx, ty);
        return true;
    }
}

class DisplayObjectContainer extends DisplayObject {

    /**
     * 子容器
     */
    contentsArray: DisplayObject[] = [];


    /**
     * 添加一个子容器
     */
    addChild(newElement: DisplayObject) {

        let ifAlreadyExist = false;

        for (let oldEle of this.contentsArray) {
            if (oldEle == newElement) {
                ifAlreadyExist = true;
                break;
            }
        }

        if (ifAlreadyExist) {
            console.log("already have same Element");
        } else {

            this.contentsArray.push(newElement);
            newElement.parent = this;
        }
    }

    /**
     * 删除指定子容器
     */
    removeChild(deleteElement: DisplayObject) {

        let ifExist = false;
        let goalNumber = 0;

        for (let del of this.contentsArray) {
            if (del == deleteElement) {
                ifExist = true;
                break;
            }
            goalNumber++;
        }

        if (!ifExist) {
            console.log("no element found!!");
        } else {
            this.contentsArray.splice(goalNumber, 1);
        }
    }


    protected render(context: CanvasRenderingContext2D) {

        for (let content of this.contentsArray) {
            content.draw(context);
        }
    }
}


class TextField extends DisplayObject {

    text = "";
    color = "#000000";
    font = "15px Arial"

    protected render(context: CanvasRenderingContext2D) {

        //透明度
        context.globalAlpha = this.globalAlpha;
        //填充颜色
        context.fillStyle = this.color;
        //文本格式
        context.font = this.font;
        //绘制文本
        context.fillText(this.text, 0, 0);
    }
}

class Bitmap extends DisplayObject {

    /**
     * 图片路径
     */
    url = "";

    protected render(context: CanvasRenderingContext2D) {

        var img = new Image();
        img.src = this.url;
        img.onload = () => {
            context.globalAlpha = this.globalAlpha;
            context.drawImage(img, 0, 0);
        }
    }
}