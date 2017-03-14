declare namespace math {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor();
        isPointInRect(point: math.Point): boolean;
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace engine {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    class Ticker {
        private static instance;
        listeners: Ticker_Listener_Type[];
        static getInstance(): Ticker;
        register(listener: Ticker_Listener_Type): void;
        unregister(listener: Ticker_Listener_Type): void;
        notify(deltaTime: number): void;
    }
}
declare namespace engine {
    /**
     * 定义一个鼠标事件
     */
    class _TouchEvent {
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
        useCapture: boolean;
        constructor(Mouse_Event: MOUSE_EVENT, react: (e?: MouseEvent) => void, useCapture?: boolean);
    }
    enum MOUSE_EVENT {
        mousedown = 1,
        mousemove = 2,
        mouseup = 3,
        click = 4,
    }
    /**
     * 实现此接口以渲染
     */
    interface Drawable {
        render(context: CanvasRenderingContext2D): any;
        hitTest(hitPoint: math.Point): DisplayObject;
    }
    /**
     * 事件派发器接口
     */
    interface IDispatcher {
        /**
         * 注册对鼠标事件的兴趣
         */
        addEventListener(eventType: MOUSE_EVENT, listener: (e?: MouseEvent) => void, useCapture?: boolean): any;
        /**
         * 删除对鼠标事件的兴趣
         */
        removeEventListener(eventType: MOUSE_EVENT, listener: Function, useCapture?: boolean): any;
        /**
         * 派发一个鼠标事件
         */
        dispatchEvent(event: {
            type: MOUSE_EVENT;
            target: DisplayObject;
            currentTarget: DisplayObject;
        }): any;
    }
    abstract class Dispatcher {
        /**
         * 监听鼠标事件的显示对象列表
         */
        /**
         * 本次鼠标事件需要执行的事件队列，按照捕获后的顺序
         */
        static doEventOrderList: _TouchEvent[];
        /**
         * 执行事件队列
         */
        static doEventList(e: MouseEvent): void;
    }
    abstract class DisplayObject implements Drawable, IDispatcher {
        /**
         * 父容器
         */
        parent: DisplayObjectContainer;
        /**
         * addEventListener添加的所有事件存储在此数组
         */
        selfEvents: _TouchEvent[];
        x: number;
        y: number;
        protected globalAlpha: number;
        /**
         * 透明度
         */
        alpha: number;
        ScaleX: number;
        ScaleY: number;
        /**
         *旋转(角度制)
         */
        rotation: number;
        protected globalMatrix: math.Matrix;
        protected localMatrix: math.Matrix;
        /**
         * 是否检测碰撞
         */
        touchEnable: boolean;
        /**
         * 调用所有子容器的render方法
         */
        draw(context: CanvasRenderingContext2D): void;
        /**
         * 子类覆写该方法获得碰撞检测
         */
        abstract hitTest(hitPoint: math.Point): DisplayObject;
        /**
         * 子类覆写render方法渲染
         */
        abstract render(context: CanvasRenderingContext2D): any;
        /**
         * 添加事件侦听器
         */
        addEventListener(type: MOUSE_EVENT, react: (e?: MouseEvent) => void, useCapture?: boolean): void;
        /**
         * 删除事件侦听器
         */
        removeEventListener(eventType: MOUSE_EVENT, listener: Function, useCapture?: boolean): void;
        /**
         * 判断是否存在事件侦听器
         */
        hasEventListener(): boolean;
        /**
         * 根据是否开启捕获，发送事件到事件队列头或尾
         */
        dispatchEvent(event: {
            type: MOUSE_EVENT;
            target: DisplayObject;
            currentTarget: DisplayObject;
        }): void;
        /**
         * 计算全局矩阵和本地矩阵,成功则返回true
         */
        protected analysisMatrix(context: CanvasRenderingContext2D): boolean;
    }
    class DisplayObjectContainer extends DisplayObject {
        /**
         * 显示列表
         */
        children: DisplayObject[];
        /**
         * 添加一个现实对象，成功返回true
         */
        addChild(newElement: DisplayObject): boolean;
        /**
         * 删除指定子容器
         */
        removeChild(deleteElement: DisplayObject): boolean;
        /**
         * 交换两个子物体，成功返回true，失败返回false
         */
        swapChildren(object1: DisplayObject, object2: DisplayObject): boolean;
        /**
         * 判断是否存在传入的子物体，存在则返回子物体位置，否则返回-1
         */
        indexOfChildren(object: DisplayObject): number;
        render(context: CanvasRenderingContext2D): void;
        hitTest(hitPoint: math.Point): DisplayObject;
    }
    class Stage extends DisplayObjectContainer {
        /**
         * 舞台宽
         */
        stageW: number;
        /**
         * 舞台高
         */
        stageH: number;
        constructor(stageX: number, stageY: number);
    }
    /**
     * 图形(暂时为矩形)
     */
    class Shape extends DisplayObject {
        /**
         * 图形宽度
         */
        width: number;
        /**
         * 图形高度
         */
        height: number;
        /**
         * 图形颜色
         */
        color: string;
        render(context: CanvasRenderingContext2D): void;
        /**
         * 检测是否点击到Shape
         */
        hitTest(hitPoint: math.Point): DisplayObject;
    }
    class TextField extends DisplayObject {
        /**
         * 文本内容
         */
        text: string;
        /**
         * 文本颜色
         */
        color: string;
        /**
         * 文本格式，例如"15px Arial"
         */
        font: string;
        private _measureTextWidth;
        render(context: CanvasRenderingContext2D): void;
        /**
         * 判断是否点击到文字
         */
        hitTest(hitPoint: math.Point): DisplayObject;
    }
    class Bitmap extends DisplayObject {
        /**
         * 图片路径
         */
        url: string;
        img: HTMLImageElement;
        protected hasLoaded: boolean;
        width: number;
        height: number;
        render(context: CanvasRenderingContext2D): void;
        /**
         * 改变bitmap
         */
        changeBitmap(url: string): void;
        /**
         * 判断是否点击倒图片
         */
        hitTest(hitPoint: math.Point): DisplayObject;
    }
    class MovieClip extends Bitmap {
        private advancedTime;
        private static FRAME_TIME;
        private TOTAL_FRAME;
        private currentFrameIndex;
        data: MovieClipData;
        constructor(data: MovieClipData);
        ticker: (deltaTime: any) => void;
        play(): void;
        stop(): void;
        setMovieClipData(data: MovieClipData): void;
    }
    type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
    class MovieClipFrameDataFactory {
        private urls;
        constructor(urls: string[]);
        generateMovieClipData(animationName: string): MovieClipData;
    }
}
declare namespace engine {
    let run: (canvas: HTMLCanvasElement) => Stage;
}
