var Dispatcher = (function () {
    function Dispatcher() {
    }
    /**
     * 执行事件队列
     */
    Dispatcher.doEventList = function (e) {
        for (var _i = 0, _a = Dispatcher.doEventOrderList; _i < _a.length; _i++) {
            var i = _a[_i];
            i.react(e);
        }
        Dispatcher.doEventOrderList = [];
    };
    /**
     * 判断点击到的物体是否监听鼠标事件
     */
    Dispatcher.isInInterested = function (displayObject) {
        var result = false;
        for (var i = 0; i < Dispatcher.dispatcherList.length; i++) {
            var container = Dispatcher.dispatcherList[i];
            if (displayObject == container) {
                result = true;
                break;
            }
        }
        return result;
    };
    /**
     * 监听鼠标事件的DisplayObject
     */
    Dispatcher.dispatcherList = [];
    /**
     * 本次鼠标事件需要执行的事件队列
     */
    Dispatcher.doEventOrderList = [];
    return Dispatcher;
}());
var DisplayObject = (function () {
    function DisplayObject() {
        /**
         * addEventListener添加的所有事件存储在此数组
         */
        this.selfEvents = [];
        this.x = 0;
        this.y = 0;
        this.globalAlpha = 1;
        /**
         * 透明度
         */
        this.alpha = 1;
        this.ScaleX = 1;
        this.ScaleY = 1;
        /**
         *旋转(角度制)
         */
        this.rotation = 0;
        /**
         * 是否检测碰撞
         */
        this.touchEnable = true;
    }
    /**
     * 调用所有子容器的render方法
     */
    DisplayObject.prototype.draw = function (context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, 1000, 1000);
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
     * 子类覆写该方法获得碰撞检测
     */
    DisplayObject.prototype.hitTest = function (hitPoint) {
        return;
    };
    /**
     * 子类覆写render方法渲染
     */
    DisplayObject.prototype.render = function (context) {
    };
    /**
     * 添加事件侦听器
     */
    DisplayObject.prototype.addEventListener = function (type, react, useCapture) {
        var selfEvent;
        if (useCapture) {
            selfEvent = new _TouchEvent(type, react, useCapture);
        }
        else {
            selfEvent = new _TouchEvent(type, react);
        }
        this.selfEvents.push(selfEvent);
    };
    /**
     * 删除事件侦听器
     */
    DisplayObject.prototype.removeEventListener = function (eventType, listener, useCapture) {
        for (var i = 0; i < this.selfEvents.length; i++) {
            var compare = this.selfEvents[i];
            if (compare.Mouse_Event == eventType
                && compare.react == listener
                && compare.useCapture == useCapture) {
                this.selfEvents.splice(i, 1);
                console.log("remove success!");
                break;
            }
        }
    };
    /**
     * 根据是否开启捕获，发送事件到事件队列头或尾
     */
    DisplayObject.prototype.dispatchEvent = function (event) {
        var allEvents = event.currentTarget.selfEvents;
        for (var i = 0; i < allEvents.length; i++) {
            if (event.type == allEvents[i].Mouse_Event) {
                if (allEvents[i].useCapture) {
                    Dispatcher.doEventOrderList.unshift(allEvents[i]);
                }
                else {
                    Dispatcher.doEventOrderList.push(allEvents[i]);
                }
            }
        }
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
            this.globalMatrix = math.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
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
//# sourceMappingURL=DisplayObject.js.map