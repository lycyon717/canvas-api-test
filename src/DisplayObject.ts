
/**
 * 实现此接口以渲染
 */
interface Drawable {

    render(context: CanvasRenderingContext2D);
    hitTest(hitPoint: math.Point): DisplayObject;
}

/**
 * 实现此接口实现捕获/冒泡机制
 */
interface IDispatcher {

    /**
     * 注册对鼠标事件的兴趣
     */
    addEventListener(eventType: MOUSE_EVENT, listener: (e?: MouseEvent) => void, useCapture?: boolean);

    /**
     * 删除对鼠标事件的兴趣
     */
    removeEventListener(eventType: MOUSE_EVENT, listener: Function, useCapture?: boolean);

    /**
     * 派发事件
     */
    dispatchEvent(event: { type: MOUSE_EVENT, target: DisplayObject, currentTarget: DisplayObject });

}

abstract class Dispatcher {

    /**
     * 监听鼠标事件的DisplayObject
     */
    static dispatcherList: DisplayObject[] = [];

    /**
     * 本次鼠标事件需要执行的事件队列
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
    static isInInterested(displayObject: DisplayObject): boolean {
        let result = false;
        for (let i = 0; i < Dispatcher.dispatcherList.length; i++) {
            let container = Dispatcher.dispatcherList[i];
            if (displayObject == container) {
                result = true;
                break;
            }
        }
        return result;
    }
}

abstract class DisplayObject implements Drawable, IDispatcher {

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

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, 1000, 1000);

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
    hitTest(hitPoint: math.Point): DisplayObject {
        return;
    }

    /**
     * 子类覆写render方法渲染
     */
    render(context: CanvasRenderingContext2D) {
    }

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
     * 初始化全局矩阵和本地矩阵,成功则返回true
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