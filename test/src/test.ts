window.onload = () => {
    var c = document.getElementById("myCanvas") as HTMLCanvasElement;
    var stage = engine.run(c);

    // var bitmap = new engine.Bitmap();
    // bitmap.url = "huli.jpg";
    // bitmap.x = 50;
    // bitmap.y = 50;

    // var button = new engine.Bitmap();
    // button.url = "timg.jpg";
    // button.x = 500;
    // button.y = 500;

    // var cont = new engine.DisplayObjectContainer();
    // cont.y = 100;

    // cont.addChild(bitmap);
    // cont.addChild(button);

    // stage.addChild(cont);

    var urls: string[] = ["S0.png", "S1.png", "S2.png", "S3.png", "S4.png", "S5.png", "S6.png"
        , "S7.png", "S8.png", "S9.png", "S10.png", "S11.png", "S12.png"];

    var movieClipFactory = new engine.MovieClipFrameDataFactory(urls);

    var result = movieClipFactory.generateMovieClipData("run");

    var animation = new engine.MovieClip(result);

    animation.x = 500;
    animation.y = 500;

    stage.addChild(animation);

    // var initx = cont.x;
    // var inity = cont.y;

    // bitmap.addEventListener(engine.MOUSE_EVENT.mousemove, (e) => {
    //     cont.x += e.movementX;
    //     cont.y += e.movementY;
    //     button.touchEnable = false;
    // }, true);

    // bitmap.addEventListener(engine.MOUSE_EVENT.mouseup, (e) => {
    //     cont.x = initx;
    //     cont.y = inity;
    // });

    // bitmap.addEventListener(engine.MOUSE_EVENT.mousedown, () => {
    //     button.touchEnable = true;
    // });

    // animation.addEventListener(engine.MOUSE_EVENT.click, (e) => {
    //     console.log("clicked!!!!!!!");
    //     console.log(e.clientX, e.clientY);
    //     console.log(e.x, e.y);
    // });

}
