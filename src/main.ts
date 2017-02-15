

window.onload = () => {

    var c = document.getElementById("myCanvas") as HTMLCanvasElement;
    var cxt = c.getContext("2d");

    var stage = new DisplayObjectContainer();

    var text = new TextField();
    text.text = "Hello World!!!!"
    text.x = 10;
    text.y = 10;

    var bitmap = new Bitmap();
    bitmap.url = "huli.jpg";
    bitmap.x = 50;
    bitmap.y = 50;

    stage.addChild(text);
    stage.addChild(bitmap);

    stage.draw(cxt);
};

interface drawable {

    draw(context: CanvasRenderingContext2D);
}

class DisplayObjectContainer implements drawable {

    x: number = 0;
    y: number = 0;

    contentsArray: DisplayObjectContainer[] = [];

    addChild(newEle: DisplayObjectContainer) {
        this.contentsArray.push(newEle);
    }

    draw(context: CanvasRenderingContext2D) {


        for (let content of this.contentsArray) {
            content.draw(context);
        }
    }
}

class TextField extends DisplayObjectContainer {

    text: string = "";

    draw(context: CanvasRenderingContext2D) {

        context.fillText(this.text, this.x, this.y);
    }
}

class Bitmap extends DisplayObjectContainer {

    url: string = "";

    draw(context: CanvasRenderingContext2D) {

        var img = new Image();
        img.src = this.url;
        img.onload = () => {
            context.drawImage(img, this.x, this.y);
        }
    }
}