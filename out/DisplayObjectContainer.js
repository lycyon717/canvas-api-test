// TypeScript file
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        /**
         * 子容器
         */
        this.children = [];
    }
    /**
     * 添加一个子容器
     */
    DisplayObjectContainer.prototype.addChild = function (newElement) {
        var ifAlreadyExist = false;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
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
            this.children.push(newElement);
            newElement.parent = this;
        }
    };
    /**
     * 删除指定子容器
     */
    DisplayObjectContainer.prototype.removeChild = function (deleteElement) {
        var ifExist = false;
        var goalNumber = 0;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
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
            this.children.splice(goalNumber, 1);
        }
    };
    DisplayObjectContainer.prototype.render = function (context) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw(context);
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (hitPoint) {
        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            var invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
            var pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
            var hitTestResult = child.hitTest(pointBaseOnChild);
            if (hitTestResult) {
                return hitTestResult; //以后做成一个数组，检测多个
            }
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
//# sourceMappingURL=DisplayObjectContainer.js.map