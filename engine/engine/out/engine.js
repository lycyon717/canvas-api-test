var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var math;
(function (math) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    math.Point = Point;
    var Rectangle = (function () {
        function Rectangle() {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        Rectangle.prototype.isPointInRect = function (point) {
            if (point.x > this.x
                && point.y > this.y
                && point.x < this.x + this.width
                && point.y < this.y + this.height) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    math.Rectangle = Rectangle;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    math.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    math.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    math.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    math.Matrix = Matrix;
})(math || (math = {}));
var engine;
(function (engine) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
        }
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return this.instance;
        };
        Ticker.prototype.register = function (listener) {
            this.listeners.push(listener);
        };
        Ticker.prototype.unregister = function (listener) {
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    engine.Ticker = Ticker;
})(engine || (engine = {}));
var engine;
(function (engine) {
    /**
     * 定义一个鼠标事件
     */
    var _TouchEvent = (function () {
        function _TouchEvent(Mouse_Event, react, useCapture) {
            /**
             * 是否开启捕捉
             */
            this.useCapture = false;
            this.Mouse_Event = Mouse_Event;
            this.react = react;
            if (useCapture) {
                this.useCapture = useCapture;
            }
        }
        return _TouchEvent;
    }());
    engine._TouchEvent = _TouchEvent;
    (function (MOUSE_EVENT) {
        MOUSE_EVENT[MOUSE_EVENT["mousedown"] = 1] = "mousedown";
        MOUSE_EVENT[MOUSE_EVENT["mousemove"] = 2] = "mousemove";
        MOUSE_EVENT[MOUSE_EVENT["mouseup"] = 3] = "mouseup";
        MOUSE_EVENT[MOUSE_EVENT["click"] = 4] = "click";
    })(engine.MOUSE_EVENT || (engine.MOUSE_EVENT = {}));
    var MOUSE_EVENT = engine.MOUSE_EVENT;
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
         * 监听鼠标事件的显示对象列表
         */
        // static dispatcherList: DisplayObject[] = [];
        /**
         * 本次鼠标事件需要执行的事件队列，按照捕获后的顺序
         */
        Dispatcher.doEventOrderList = [];
        return Dispatcher;
    }());
    engine.Dispatcher = Dispatcher;
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
         * 判断是否存在事件侦听器
         */
        DisplayObject.prototype.hasEventListener = function () {
            return this.selfEvents && this.selfEvents.length == 0 ? false : true;
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
         * 计算全局矩阵和本地矩阵,成功则返回true
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
    engine.DisplayObject = DisplayObject;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            _super.apply(this, arguments);
            /**
             * 显示列表
             */
            this.children = [];
        }
        /**
         * 添加一个现实对象，成功返回true
         */
        DisplayObjectContainer.prototype.addChild = function (newElement) {
            // let index = this.indexOfChildren(newElement);
            // if (index == -1) {
            //     console.log("already have same Element");
            //     return false;
            // }
            this.children.push(newElement);
            newElement.parent = this;
            return true;
        };
        /**
         * 删除指定子容器
         */
        DisplayObjectContainer.prototype.removeChild = function (deleteElement) {
            var index = this.indexOfChildren(deleteElement);
            if (index == -1) {
                console.log("no element found!!");
                return false;
            }
            else {
                this.children.splice(index, 1);
                return true;
            }
        };
        /**
         * 交换两个子物体，成功返回true，失败返回false
         */
        DisplayObjectContainer.prototype.swapChildren = function (object1, object2) {
            var object1Index = this.indexOfChildren(object1);
            var object2Index = this.indexOfChildren(object2);
            if (object1Index == -1 || object2Index == -1) {
                return false;
            }
            else {
                var temp = this.children[object1Index];
                this.children[object1Index] = this.children[object2Index];
                this.children[object2Index] = temp;
                return true;
            }
        };
        /**
         * 判断是否存在传入的子物体，存在则返回子物体位置，否则返回-1
         */
        DisplayObjectContainer.prototype.indexOfChildren = function (object) {
            var goalNumber = 0;
            var ifExist = false;
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var del = _a[_i];
                if (del == object) {
                    ifExist = true;
                    break;
                }
                goalNumber++;
            }
            if (ifExist) {
                return goalNumber;
            }
            else {
                return -1;
            }
            // return ifExist ? -1 : goalNumber
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
    engine.DisplayObjectContainer = DisplayObjectContainer;
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage(stageX, stageY) {
            _super.call(this);
            this.stageW = stageX;
            this.stageH = stageY;
        }
        return Stage;
    }(DisplayObjectContainer));
    engine.Stage = Stage;
    /**
     * 图形(暂时为矩形)
     */
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            _super.apply(this, arguments);
            /**
             * 图形宽度
             */
            this.width = 0;
            /**
             * 图形高度
             */
            this.height = 0;
            /**
             * 图形颜色
             */
            this.color = "#000000";
        }
        Shape.prototype.render = function (context) {
            //透明度
            context.globalAlpha = this.globalAlpha;
            //填充颜色
            context.fillStyle = this.color;
            //绘制矩形
            context.fillRect(0, 0, this.width, this.height);
        };
        /**
         * 检测是否点击到Shape
         */
        Shape.prototype.hitTest = function (hitPoint) {
            var rect = new math.Rectangle();
            rect.width = this.width;
            rect.height = this.height;
            var invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
            var pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
            return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
        };
        return Shape;
    }(DisplayObject));
    engine.Shape = Shape;
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            _super.apply(this, arguments);
            /**
             * 文本内容
             */
            this.text = "";
            /**
             * 文本颜色
             */
            this.color = "#000000";
            /**
             * 文本格式，例如"15px Arial"
             */
            this.font = "15px Arial";
            this._measureTextWidth = 0;
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
            //计算文本宽度
            this._measureTextWidth = context.measureText(this.text).width;
        };
        /**
         * 判断是否点击到文字
         */
        TextField.prototype.hitTest = function (hitPoint) {
            var rect = new math.Rectangle();
            rect.width = this._measureTextWidth;
            rect.height = 20;
            var invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
            var pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
            return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
        };
        return TextField;
    }(DisplayObject));
    engine.TextField = TextField;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            _super.apply(this, arguments);
            /**
             * 图片路径
             */
            this.url = "";
            this.img = new Image();
            this.hasLoaded = false;
        }
        Bitmap.prototype.render = function (context) {
            var _this = this;
            var paint = function () {
                context.globalAlpha = _this.globalAlpha;
                if (_this.width && _this.height) {
                    context.drawImage(_this.img, 0, 0, _this.width, _this.height);
                }
                else {
                    context.drawImage(_this.img, 0, 0);
                }
            };
            if (this.hasLoaded) {
                paint();
            }
            else {
                this.img.src = this.url;
                this.img.onload = function () {
                    paint();
                    _this.hasLoaded = true;
                };
            }
        };
        /**
         * 改变bitmap
         */
        Bitmap.prototype.changeBitmap = function (url) {
            if (this.url != url) {
                this.url = url;
                this.hasLoaded = false;
            }
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
    engine.Bitmap = Bitmap;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data) {
            var _this = this;
            _super.call(this);
            this.advancedTime = 0;
            this.TOTAL_FRAME = 0;
            this.data = { name: "", frames: [] };
            this.ticker = function (deltaTime) {
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MovieClip.FRAME_TIME * _this.TOTAL_FRAME) {
                    _this.advancedTime -= MovieClip.FRAME_TIME * _this.TOTAL_FRAME;
                }
                _this.currentFrameIndex = Math.floor(_this.advancedTime / MovieClip.FRAME_TIME);
                var data = _this.data;
                var frameData = data.frames[_this.currentFrameIndex];
                var newUrl = frameData.image;
                _this.changeBitmap(newUrl);
            };
            this.setMovieClipData(data);
            this.play();
        }
        MovieClip.prototype.play = function () {
            engine.Ticker.getInstance().register(this.ticker);
        };
        MovieClip.prototype.stop = function () {
            engine.Ticker.getInstance().unregister(this.ticker);
        };
        MovieClip.prototype.setMovieClipData = function (data) {
            this.data = data;
            this.currentFrameIndex = 0;
            this.TOTAL_FRAME = this.data.frames.length;
        };
        MovieClip.FRAME_TIME = 60;
        return MovieClip;
    }(Bitmap));
    engine.MovieClip = MovieClip;
    var MovieClipFrameDataFactory = (function () {
        function MovieClipFrameDataFactory(urls) {
            this.urls = [];
            if (!urls) {
                console.log("no urls");
                return;
            }
            this.urls = urls;
        }
        MovieClipFrameDataFactory.prototype.generateMovieClipData = function (animationName) {
            var result = { name: "", frames: [] };
            result.name = animationName;
            for (var urlIndex = 0; urlIndex < this.urls.length; urlIndex++) {
                var movieClipFrameData = { image: "" };
                movieClipFrameData.image = this.urls[urlIndex];
                result.frames.push(movieClipFrameData);
            }
            return result;
        };
        return MovieClipFrameDataFactory;
    }());
    engine.MovieClipFrameDataFactory = MovieClipFrameDataFactory;
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.run = function (canvas) {
        var stage = new engine.Stage(canvas.width, canvas.height);
        var context2D = canvas.getContext("2d");
        var react = function (e, type) {
            var x = e.offsetX;
            var y = e.offsetY;
            var target = stage.hitTest(new math.Point(x, y));
            var currentTarget = target;
            if (currentTarget) {
                var e1 = { type: type, target: target, currentTarget: currentTarget };
                currentTarget.dispatchEvent(e1);
                while (currentTarget.parent) {
                    currentTarget = currentTarget.parent;
                    var event_1 = { type: type, target: target, currentTarget: currentTarget };
                    currentTarget.dispatchEvent(event_1);
                }
                engine.Dispatcher.doEventList(e);
            }
        };
        window.onmousedown = function (e) {
            react(e, engine.MOUSE_EVENT.mousedown);
            var initx = e.offsetX;
            var inity = e.offsetY;
            console.log("mouse down");
            window.onmousemove = function (e) {
                react(e, engine.MOUSE_EVENT.mousemove);
                console.log("mouse move");
            };
            window.onmouseup = function (e) {
                react(e, engine.MOUSE_EVENT.mouseup);
                var resultX = e.offsetX - initx;
                var resultY = e.offsetY - inity;
                if (Math.abs(resultX) < 10 && Math.abs(resultY) < 10) {
                    react(e, engine.MOUSE_EVENT.click);
                    console.log("click");
                }
                console.log("mouse up");
                window.onmousemove = function () {
                };
                window.onmouseup = function () {
                };
            };
        };
        var lastNow = Date.now();
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 1000, 1000);
            context2D.save();
            stage.draw(context2D);
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        return stage;
    };
})(engine || (engine = {}));
