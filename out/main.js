var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var c = document.getElementById("myCanvas");
    var cxt = c.getContext("2d");
    var stage = new DisplayObjectContainer();
    var text = new TextField();
    text.text = "Hello World!!!!";
    text.x = 20;
    text.y = 20;
    text.color = "#00FF00";
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
    setInterval(function () {
        text.x += 10;
        bitmap.x += 10;
        cxt.setTransform(1, 0, 0, 1, 0, 0);
        cxt.clearRect(0, 0, 800, 800);
        stage.draw(cxt);
    }, 500);
};
var DisplayObject = (function () {
    function DisplayObject() {
        //本地坐标
        this.x = 0;
        this.y = 0;
        //透明度
        this.globalAlpha = 1;
        this.alpha = 1;
        this.ScaleX = 1;
        this.ScaleY = 1;
        this.Scale = 1;
        /**
         *旋转(角度制)
         */
        this.rotation = 0;
    }
    /**
     * 调用所有子容器的render方法
     */
    DisplayObject.prototype.draw = function (context) {
        if (this.analysisMatrix(context)) {
            if (!this.parent) {
                this.globalAlpha = this.alpha;
            }
            else {
                this.globalAlpha = this.alpha * this.parent.globalAlpha;
            }
            this.render(context);
        }
        else {
            console.log("container wrong!");
            return;
        }
    };
    /**
     * 子类覆写render方法
     */
    DisplayObject.prototype.render = function (context) {
    };
    /**
     * 初始化全局矩阵和本地矩阵,成功则返回true
     */
    DisplayObject.prototype.analysisMatrix = function (context) {
        this.localMatrix = new math.Matrix();
        this.localMatrix.updateFromDisplayObject(this.x, this.y, this.ScaleX, this.ScaleY, this.rotation);
        if (!this.parent) {
            this.globalMatrix = this.localMatrix;
        }
        else {
            this.globalMatrix = math.matrixAppendMatrix(this.parent.globalMatrix, this.localMatrix);
        }
        var a = this.globalMatrix.a;
        var b = this.globalMatrix.b;
        var c = this.globalMatrix.c;
        var d = this.globalMatrix.d;
        var tx = this.globalMatrix.tx;
        var ty = this.globalMatrix.ty;
        context.setTransform(a, b, c, d, tx, ty);
        return true;
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        /**
         * 子容器
         */
        this.contentsArray = [];
    }
    /**
     * 添加一个子容器
     */
    DisplayObjectContainer.prototype.addChild = function (newElement) {
        var ifAlreadyExist = false;
        for (var _i = 0, _a = this.contentsArray; _i < _a.length; _i++) {
            var oldEle = _a[_i];
            if (oldEle == newElement) {
                ifAlreadyExist = true;
                break;
            }
        }
        if (ifAlreadyExist) {
            console.log("already have same Element");
        }
        else {
            this.contentsArray.push(newElement);
            newElement.parent = this;
        }
    };
    /**
     * 删除指定子容器
     */
    DisplayObjectContainer.prototype.removeChild = function (deleteElement) {
        var ifExist = false;
        var goalNumber = 0;
        for (var _i = 0, _a = this.contentsArray; _i < _a.length; _i++) {
            var del = _a[_i];
            if (del == deleteElement) {
                ifExist = true;
                break;
            }
            goalNumber++;
        }
        if (!ifExist) {
            console.log("no element found!!");
        }
        else {
            this.contentsArray.splice(goalNumber, 1);
        }
    };
    DisplayObjectContainer.prototype.render = function (context) {
        for (var _i = 0, _a = this.contentsArray; _i < _a.length; _i++) {
            var content = _a[_i];
            content.draw(context);
        }
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "#000000";
        this.font = "15px Arial";
    }
    TextField.prototype.render = function (context) {
        //透明度
        context.globalAlpha = this.globalAlpha;
        //填充颜色
        context.fillStyle = this.color;
        //文本格式
        context.font = this.font;
        //绘制文本
        context.fillText(this.text, 0, 0);
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
        /**
         * 图片路径
         */
        this.url = "";
    }
    Bitmap.prototype.render = function (context) {
        var _this = this;
        var img = new Image();
        img.src = this.url;
        img.onload = function () {
            context.globalAlpha = _this.globalAlpha;
            context.drawImage(img, 0, 0);
        };
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=main.js.map