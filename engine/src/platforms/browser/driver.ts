namespace engine {

    export let run = (canvas: HTMLCanvasElement) => {
        var stage = new Stage(canvas.width, canvas.height);
        let context2D = canvas.getContext("2d");

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
            console.log("mouse down");

            window.onmousemove = (e) => {
                react(e, MOUSE_EVENT.mousemove);
                console.log("mouse move");

            }

            window.onmouseup = (e) => {
                react(e, MOUSE_EVENT.mouseup);

                let resultX = e.offsetX - initx;
                let resultY = e.offsetY - inity;
                if (Math.abs(resultX) < 10 && Math.abs(resultY) < 10) {
                    react(e, MOUSE_EVENT.click)
                    console.log("click")
                }
                console.log("mouse up");


                window.onmousemove = () => {
                }
                window.onmouseup = () => {
                }
            }
        }

        let lastNow = Date.now();

        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 1000, 1000);
            context2D.save();
            stage.draw(context2D);
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        return stage;
    }
}