
window.onload = () => {

    var c = document.getElementById("myCanvas") as HTMLCanvasElement;
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

    bitmap.addEventListener(MOUSE_EVENT.mousemove, (e) => {
        cont.x += e.movementX;
        cont.y += e.movementY;

        stage.draw(cxt);
        button.touchEnable = false;
    }, true);

    bitmap.addEventListener(MOUSE_EVENT.mouseup, (e) => {
        cont.x = initx;
        cont.y = inity;
        stage.draw(cxt);
    });

    bitmap.addEventListener(MOUSE_EVENT.mousedown, () => {
        button.touchEnable = true;
    });

    button.addEventListener(MOUSE_EVENT.click, () => {
        console.log("clicked!!!!!!!");
    })

    var react = (e: MouseEvent, type: MOUSE_EVENT) => {
        let x = e.offsetX;
        let y = e.offsetY;

        let target = stage.hitTest(new math.Point(x, y));
        var currentTarget = target;

        if (currentTarget) {

            let e1 = { type, target, currentTarget };
            currentTarget.dispatchEvent(e1);

            while (currentTarget.parent) {
                currentTarget = currentTarget.parent;
                let event = { type, target, currentTarget };
                currentTarget.dispatchEvent(event);
            }
            Dispatcher.doEventList(e);
        }
    }

    window.onmousedown = (e) => {
        react(e, MOUSE_EVENT.mousedown);
        var initx = e.offsetX;
        var inity = e.offsetY;

        window.onmousemove = (e) => {
            react(e, MOUSE_EVENT.mousemove);
        }

        window.onmouseup = (e) => {
            react(e, MOUSE_EVENT.mouseup);

            let resultX = e.offsetX - initx;
            let resultY = e.offsetY - inity;
            if (Math.abs(resultX) < 10 && Math.abs(resultY) < 10) {
                react(e, MOUSE_EVENT.click)
            }

            window.onmousemove = () => {
            }
            window.onmouseup = () => {
            }
        }
    }
};