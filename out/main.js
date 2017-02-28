window.onload = function () {
    var c = document.getElementById("myCanvas");
    var cxt = c.getContext("2d");
    var stage = new DisplayObjectContainer();
    var bitmap = new Bitmap();
    bitmap.url = "huli.jpg";
    bitmap.x = 50;
    bitmap.y = 50;
    var button = new Bitmap();
    button.url = "timg.jpg";
    button.x = 100;
    button.y = 100;
    var cont = new DisplayObjectContainer();
    cont.y = 100;
    cont.addChild(bitmap);
    cont.addChild(button);
    stage.addChild(cont);
    stage.draw(cxt);
    var initx = cont.x;
    var inity = cont.y;
    bitmap.addEventListener(MOUSE_EVENT.mousemove, function (e) {
        cont.x += e.movementX;
        cont.y += e.movementY;
        stage.draw(cxt);
        button.touchEnable = false;
    }, true);
    bitmap.addEventListener(MOUSE_EVENT.mouseup, function (e) {
        cont.x = initx;
        cont.y = inity;
        stage.draw(cxt);
    });
    bitmap.addEventListener(MOUSE_EVENT.mousedown, function () {
        button.touchEnable = true;
    });
    button.addEventListener(MOUSE_EVENT.click, function () {
        console.log("clicked!!!!!!!");
    });
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
            Dispatcher.doEventList(e);
        }
    };
    window.onmousedown = function (e) {
        react(e, MOUSE_EVENT.mousedown);
        var initx = e.offsetX;
        var inity = e.offsetY;
        window.onmousemove = function (e) {
            react(e, MOUSE_EVENT.mousemove);
        };
        window.onmouseup = function (e) {
            react(e, MOUSE_EVENT.mouseup);
            var resultX = e.offsetX - initx;
            var resultY = e.offsetY - inity;
            if (Math.abs(resultX) < 10 && Math.abs(resultY) < 10) {
                react(e, MOUSE_EVENT.click);
            }
            window.onmousemove = function () {
            };
            window.onmouseup = function () {
            };
        };
    };
};
//# sourceMappingURL=main.js.map