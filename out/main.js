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
    text.x = 10;
    text.y = 10;
    var bitmap = new Bitmap();
    bitmap.url = "huli.jpg";
    bitmap.x = 50;
    bitmap.y = 50;
    stage.addChild(text);
    stage.addChild(bitmap);
    stage.draw(cxt);
};
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.x = 0;
        this.y = 0;
        this.contentsArray = [];
    }
    DisplayObjectContainer.prototype.addChild = function (newEle) {
        this.contentsArray.push(newEle);
    };
    DisplayObjectContainer.prototype.draw = function (context) {
        for (var _i = 0, _a = this.contentsArray; _i < _a.length; _i++) {
            var content = _a[_i];
            content.draw(context);
        }
    };
    return DisplayObjectContainer;
}());
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
    }
    TextField.prototype.draw = function (context) {
        context.fillText(this.text, this.x, this.y);
    };
    return TextField;
}(DisplayObjectContainer));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
        this.url = "";
    }
    Bitmap.prototype.draw = function (context) {
        var _this = this;
        var img = new Image();
        img.src = this.url;
        img.onload = function () {
            context.drawImage(img, _this.x, _this.y);
        };
    };
    return Bitmap;
}(DisplayObjectContainer));
//# sourceMappingURL=main.js.map