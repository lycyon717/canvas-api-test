namespace engine {

    /**
     * 定义一个鼠标事件
     */
    export class _TouchEvent {

        /**
         * 鼠标事件类型
         */
        Mouse_Event: MOUSE_EVENT;

        /**
         * 事件
         */
        react: (e?: MouseEvent) => void;

        /**
         * 是否开启捕捉
         */
        useCapture = false;

        constructor(Mouse_Event: MOUSE_EVENT, react: (e?: MouseEvent) => void, useCapture?: boolean) {
            this.Mouse_Event = Mouse_Event;
            this.react = react;
            if (useCapture) {
                this.useCapture = useCapture;
            }
        }
    }

    export enum MOUSE_EVENT {
        mousedown = 1,
        mousemove = 2,
        mouseup = 3,
        click = 4
    }


    /**
     * 实现此接口以渲染
     */
    export interface Drawable {

        render(context: CanvasRenderingContext2D);
        hitTest(hitPoint: math.Point): DisplayObject;
    }

    /**
     * 事件派发器接口
     */
    export interface IDispatcher {

        /**
         * 注册对鼠标事件的兴趣
         */
        addEventListener(eventType: MOUSE_EVENT, listener: (e?: MouseEvent) => void, useCapture?: boolean);

        /**
         * 删除对鼠标事件的兴趣
         */
        removeEventListener(eventType: MOUSE_EVENT, listener: Function, useCapture?: boolean);

        /**
         * 派发一个鼠标事件
         */
        dispatchEvent(event: { type: MOUSE_EVENT, target: DisplayObject, currentTarget: DisplayObject });

    }

    export abstract class Dispatcher {

        /**
         * 监听鼠标事件的显示对象列表
         */
        // static dispatcherList: DisplayObject[] = [];

        /**
         * 本次鼠标事件需要执行的事件队列，按照捕获后的顺序
         */
        static doEventOrderList: _TouchEvent[] = [];

        /**
         * 执行事件队列
         */
        static doEventList(e: MouseEvent) {
            for (let i of Dispatcher.doEventOrderList) {
                i.react(e);
            }
            Dispatcher.doEventOrderList = [];
        }

        /**
         * 判断点击到的物体是否监听鼠标事件
         */
        // static isInInterested(displayObject: DisplayObject): boolean {
        //     let result = false;
        //     for (let i = 0; i < Dispatcher.dispatcherList.length; i++) {
        //         let container = Dispatcher.dispatcherList[i];
        //         if (displayObject == container) {
        //             result = true;
        //             break;
        //         }
        //     }
        //     return result;
        // }
    }

    export abstract class DisplayObject implements Drawable, IDispatcher {

        /**
         * 父容器
         */
        parent: DisplayObjectContainer;

        /**
         * addEventListener添加的所有事件存储在此数组
         */
        selfEvents: _TouchEvent[] = [];

        x = 0;
        y = 0;

        protected globalAlpha = 1;

        /**
         * 透明度
         */
        alpha = 1;

        ScaleX = 1;
        ScaleY = 1;

        /**
         *旋转(角度制)
         */
        rotation = 0;

        protected globalMatrix: math.Matrix;
        protected localMatrix: math.Matrix;

        /**
         * 是否检测碰撞
         */
        touchEnable: boolean = true;

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
         * 子类覆写该方法获得碰撞检测
         */
        abstract hitTest(hitPoint: math.Point): DisplayObject;


        /**
         * 子类覆写render方法渲染
         */
        abstract render(context: CanvasRenderingContext2D);


        /**
         * 添加事件侦听器
         */
        addEventListener(type: MOUSE_EVENT, react: (e?: MouseEvent) => void, useCapture?: boolean) {

            var selfEvent;
            if (useCapture) {
                selfEvent = new _TouchEvent(type, react, useCapture);
            } else {
                selfEvent = new _TouchEvent(type, react);
            }
            this.selfEvents.push(selfEvent);
        }

        /**
         * 删除事件侦听器
         */
        removeEventListener(eventType: MOUSE_EVENT, listener: Function, useCapture?: boolean) {

            for (let i = 0; i < this.selfEvents.length; i++) {
                let compare = this.selfEvents[i]
                if (compare.Mouse_Event == eventType
                    && compare.react == listener
                    && compare.useCapture == useCapture) {

                    this.selfEvents.splice(i, 1);
                    console.log("remove success!");
                    break;
                }
            }
        }

        /**
         * 判断是否存在事件侦听器
         */
        hasEventListener(): boolean {
            return this.selfEvents && this.selfEvents.length == 0 ? false : true
        }

        /**
         * 根据是否开启捕获，发送事件到事件队列头或尾
         */
        dispatchEvent(event: { type: MOUSE_EVENT, target: DisplayObject, currentTarget: DisplayObject }) {

            var allEvents = event.currentTarget.selfEvents;
            for (let i = 0; i < allEvents.length; i++) {
                if (event.type == allEvents[i].Mouse_Event) {
                    if (allEvents[i].useCapture) {
                        Dispatcher.doEventOrderList.unshift(allEvents[i]);
                    } else {
                        Dispatcher.doEventOrderList.push(allEvents[i]);
                    }
                }
            }
        }

        /**
         * 计算全局矩阵和本地矩阵,成功则返回true
         */
        protected analysisMatrix(context: CanvasRenderingContext2D): boolean {

            this.localMatrix = new math.Matrix();
            this.localMatrix.updateFromDisplayObject(this.x, this.y, this.ScaleX, this.ScaleY, this.rotation);

            if (!this.parent) {
                this.globalMatrix = this.localMatrix;
            } else {
                this.globalMatrix = math.matrixAppendMatrix(this.localMatrix, this.parent.globalMatrix);
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

    export class DisplayObjectContainer extends DisplayObject {

        /**
         * 显示列表
         */
        children: DisplayObject[] = [];


        /**
         * 添加一个现实对象，成功返回true
         */
        addChild(newElement: DisplayObject): boolean {

            // let index = this.indexOfChildren(newElement);
            // if (index == -1) {
            //     console.log("already have same Element");
            //     return false;
            // }
            this.children.push(newElement);
            newElement.parent = this;
            return true;
        }

        /**
         * 删除指定子容器
         */
        removeChild(deleteElement: DisplayObject): boolean {

            let index = this.indexOfChildren(deleteElement);

            if (index == -1) {
                console.log("no element found!!");
                return false;
            } else {
                this.children.splice(index, 1);
                return true;
            }
        }

        /**
         * 交换两个子物体，成功返回true，失败返回false
         */
        swapChildren(object1: DisplayObject, object2: DisplayObject): boolean {
            let object1Index = this.indexOfChildren(object1);
            let object2Index = this.indexOfChildren(object2);

            if (object1Index == -1 || object2Index == -1) {
                return false;
            } else {
                let temp = this.children[object1Index];
                this.children[object1Index] = this.children[object2Index];
                this.children[object2Index] = temp;
                return true;
            }
        }

        /**
         * 判断是否存在传入的子物体，存在则返回子物体位置，否则返回-1
         */
        indexOfChildren(object: DisplayObject): number {

            let goalNumber = 0;
            let ifExist = false;
            for (let del of this.children) {
                if (del == object) {
                    ifExist = true;
                    break;
                }
                goalNumber++;
            }
            if (ifExist) {
                return goalNumber;
            } else {
                return -1;
            }
            // return ifExist ? -1 : goalNumber
        }

        render(context: CanvasRenderingContext2D) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].draw(context);
            }
        }

        hitTest(hitPoint: math.Point): DisplayObject {
            for (let i = this.children.length - 1; i >= 0; i--) {
                let child = this.children[i];
                let invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
                let pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
                let hitTestResult = child.hitTest(pointBaseOnChild);

                if (hitTestResult) {
                    return hitTestResult;   //以后做成一个数组，检测多个
                }
            }
            return null;
        }
    }

    export class Stage extends DisplayObjectContainer {

        /**
         * 舞台宽
         */
        stageW: number;

        /**
         * 舞台高
         */
        stageH: number;

        constructor(stageX: number, stageY: number) {
            super();
            this.stageW = stageX;
            this.stageH = stageY;
        }
    }

    /**
     * 图形(暂时为矩形)
     */
    export class Shape extends DisplayObject {

        /**
         * 图形宽度
         */
        width = 0;

        /**
         * 图形高度
         */
        height = 0;

        /**
         * 图形颜色
         */
        color = "#000000";

        render(context: CanvasRenderingContext2D) {

            //透明度
            context.globalAlpha = this.globalAlpha;
            //填充颜色
            context.fillStyle = this.color;
            //绘制矩形
            context.fillRect(0, 0, this.width, this.height);
        }

        /**
         * 检测是否点击到Shape
         */
        hitTest(hitPoint: math.Point): DisplayObject {

            var rect = new math.Rectangle();
            rect.width = this.width;
            rect.height = this.height;
            let invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
            let pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
            return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
        }
    }

    export class TextField extends DisplayObject {

        /**
         * 文本内容
         */
        text = "";

        /**
         * 文本颜色
         */
        color = "#000000";

        /**
         * 文本格式，例如"15px Arial"
         */
        font = "15px Arial";

        private _measureTextWidth: number = 0;


        render(context: CanvasRenderingContext2D) {

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
        }

        /**
         * 判断是否点击到文字
         */
        hitTest(hitPoint: math.Point): DisplayObject {

            var rect = new math.Rectangle();
            rect.width = this._measureTextWidth;
            rect.height = 20;
            let invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
            let pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
            return rect.isPointInRect(pointBaseOnChild) && this.touchEnable ? this : null;
        }
    }

    export class Bitmap extends DisplayObject {

        /**
         * 图片路径
         */
        url = "";

        img = new Image();

        protected hasLoaded = false;

        width: number;

        height: number;

        render(context: CanvasRenderingContext2D) {

            let paint = () => {
                context.globalAlpha = this.globalAlpha;

                if (this.width && this.height) {
                    context.drawImage(this.img, 0, 0, this.width, this.height);
                } else {
                    context.drawImage(this.img, 0, 0);
                }
            }

            if (this.hasLoaded) {
                paint();
            } else {
                this.img.src = this.url;
                this.img.onload = () => {
                    paint();
                    this.hasLoaded = true;
                }
            }
        }

        /**
         * 改变bitmap
         */
        changeBitmap(url: string) {
            if (this.url != url) {
                this.url = url;
                this.hasLoaded = false;
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

    export class MovieClip extends Bitmap {

        private advancedTime = 0;

        private static FRAME_TIME = 60;

        private TOTAL_FRAME = 0;

        private currentFrameIndex: number;

        public data: MovieClipData = { name: "", frames: [] };

        constructor(data: MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.play();
        }

        ticker = (deltaTime) => {

            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * this.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * this.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            let frameData = data.frames[this.currentFrameIndex];
            let newUrl = frameData.image;
            this.changeBitmap(newUrl);
        }

        play() {
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker);
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            this.TOTAL_FRAME = this.data.frames.length;
        }
    }

    export type MovieClipData = {
        name: string,
        frames: MovieClipFrameData[]
    }

    export type MovieClipFrameData = {
        "image": string
    }

    export class MovieClipFrameDataFactory {

        private urls: string[] = [];

        constructor(urls: string[]) {
            if (!urls) {
                console.log("no urls");
                return;
            }
            this.urls = urls;
        }

        generateMovieClipData(animationName: string): MovieClipData {
            var result: MovieClipData = { name: "", frames: [] };
            result.name = animationName;
            for (let urlIndex = 0; urlIndex < this.urls.length; urlIndex++) {
                let movieClipFrameData: MovieClipFrameData = { image: "" };
                movieClipFrameData.image = this.urls[urlIndex];
                result.frames.push(movieClipFrameData);
            }
            return result;
        }
    }
}