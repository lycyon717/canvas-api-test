// TypeScript file


class DisplayObjectContainer extends DisplayObject {

    /**
     * 子容器
     */
    children: DisplayObject[] = [];


    /**
     * 添加一个子容器
     */
    addChild(newElement: DisplayObject) {

        let ifAlreadyExist = false;

        for (let oldEle of this.children) {
            if (oldEle == newElement) {
                ifAlreadyExist = true;
                break;
            }
        }

        if (ifAlreadyExist) {
            console.log("already have same Element");
        } else {

            this.children.push(newElement);
            newElement.parent = this;
        }
    }

    /**
     * 删除指定子容器
     */
    removeChild(deleteElement: DisplayObject) {

        let ifExist = false;
        let goalNumber = 0;

        for (let del of this.children) {
            if (del == deleteElement) {
                ifExist = true;
                break;
            }
            goalNumber++;
        }

        if (!ifExist) {
            console.log("no element found!!");
        } else {
            this.children.splice(goalNumber, 1);
        }
    }


    render(context: CanvasRenderingContext2D) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw(context);
        }
    }

    hitTest(hitPoint: math.Point): DisplayObject {
        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            let invertChildLocalMatrix = math.invertMatrix(this.localMatrix);
            let pointBaseOnChild = math.pointAppendMatrix(hitPoint, invertChildLocalMatrix);
            let hitTestResult = child.hitTest(pointBaseOnChild);
            if (hitTestResult) {
                return hitTestResult;   //以后做成一个数组，检测多个
            }
        }
        return null;
    }
}