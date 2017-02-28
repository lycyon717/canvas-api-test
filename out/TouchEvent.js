// TypeScript file
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
var MOUSE_EVENT;
(function (MOUSE_EVENT) {
    MOUSE_EVENT[MOUSE_EVENT["mousedown"] = 1] = "mousedown";
    MOUSE_EVENT[MOUSE_EVENT["mousemove"] = 2] = "mousemove";
    MOUSE_EVENT[MOUSE_EVENT["mouseup"] = 3] = "mouseup";
    MOUSE_EVENT[MOUSE_EVENT["click"] = 4] = "click";
})(MOUSE_EVENT || (MOUSE_EVENT = {}));
//# sourceMappingURL=TouchEvent.js.map