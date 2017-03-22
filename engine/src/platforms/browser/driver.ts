namespace engine {

    export let run = (canvas: HTMLCanvasElement) => {
        var stage = new Stage(canvas.width, canvas.height);
        var canvasRender = new canvas2DRenderer(canvas, stage);

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
            canvasRender.draw();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        return stage;
    }

    export class canvas2DRenderer {

        private canvas2DContext: CanvasRenderingContext2D;
        private stage: Stage;

        constructor(canvas: HTMLCanvasElement, stage: Stage) {
            let context2D = canvas.getContext("2d");
            this.canvas2DContext = context2D;
            this.stage = stage;
        }

        draw() {

            let context2D = this.canvas2DContext;
            this.stage.calculate(context2D);

            context2D.clearRect(0, 0, 1000, 1000);
            context2D.save();
            for (let displayObject of DisplayObject.renderList) {
                let type = displayObject.type;
                context2D.globalAlpha = displayObject.globalAlpha;
                if (type == DISPLAYOBJECT_TYPE.Bitmap || type == DISPLAYOBJECT_TYPE.MovieClip) {
                    this.renderBitmapAndMovieClip(displayObject as Bitmap);
                }
                else if (type == DISPLAYOBJECT_TYPE.Shape) {
                    this.renderShape(displayObject as Shape);
                }
                else if (type == DISPLAYOBJECT_TYPE.TextField) {
                    this.renderTextField(displayObject as TextField);
                }
            }
            context2D.restore();
        }

        /**
         * 渲染图片或动画
         */
        private renderBitmapAndMovieClip(bitmap: Bitmap) {
            let paint = () => {
                this.canvas2DContext.globalAlpha = bitmap.globalAlpha;

                if (bitmap.width && bitmap.height) {
                    this.canvas2DContext.drawImage(bitmap.img, 0, 0, bitmap.width, bitmap.height);
                } else {
                    this.canvas2DContext.drawImage(bitmap.img, 0, 0);
                }
            }

            if (bitmap.hasLoaded) {
                paint();
            } else {
                bitmap.img.src = bitmap.url;
                bitmap.img.onload = () => {
                    paint();
                    bitmap.hasLoaded = true;
                }
            }
        }

        /**
         * 渲染文字
         */
        private renderTextField(textField: TextField) {
            //透明度
            this.canvas2DContext.globalAlpha = textField.globalAlpha;
            //填充颜色
            this.canvas2DContext.fillStyle = textField.color;
            //文本格式
            this.canvas2DContext.font = textField.font;
            //绘制文本
            this.canvas2DContext.fillText(textField.text, 0, 0);
            //计算文本宽度
            textField._measureTextWidth = this.canvas2DContext.measureText(textField.text).width;
        }

        /**
         * 渲染图形
         */
        private renderShape(shape: Shape) {
            //透明度
            this.canvas2DContext.globalAlpha = shape.globalAlpha;
            //填充颜色
            this.canvas2DContext.fillStyle = shape.color;
            //绘制矩形
            this.canvas2DContext.fillRect(0, 0, shape.width, shape.height);
        }

    }
}

