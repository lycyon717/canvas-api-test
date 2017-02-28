// TypeScript file
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    /**
     * 判断是否点击到文字
     */
    TextField.prototype.hitTest = function (hitPoint) {
        var rect = new math.Rectangle();
        rect.width = 10 * this.text.length;
        rect.height = 20;
        var invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
        var pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
        return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
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
        this.img = new Image();
    }
    Bitmap.prototype.render = function (context) {
        var _this = this;
        this.img.src = this.url;
        this.img.onload = function () {
            context.globalAlpha = _this.globalAlpha;
            context.drawImage(_this.img, 0, 0);
        };
    };
    /**
     * 判断是否点击倒图片
     */
    Bitmap.prototype.hitTest = function (hitPoint) {
        var rect = new math.Rectangle();
        rect.width = this.img.width;
        rect.height = this.img.height;
        var invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
        var pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
        return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=DisplayElement.js.map