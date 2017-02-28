// TypeScript file
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
    useCapture = false;

    constructor(Mouse_Event: MOUSE_EVENT, react: (e?: MouseEvent) => void, useCapture?: boolean) {
        this.Mouse_Event = Mouse_Event;
        this.react = react;
        if (useCapture) {
            this.useCapture = useCapture;
        }
    }
}

enum MOUSE_EVENT {
    mousedown = 1,
    mousemove = 2,
    mouseup = 3,
    click = 4
}