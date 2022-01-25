/**
 * @target web
 */
export class BrowserMouseEventArgs {
    constructor(e) {
        this.mouseEvent = e;
    }
    get isLeftMouseButton() {
        return this.mouseEvent.button === 0;
    }
    getX(relativeTo) {
        let relativeToElement = relativeTo.element;
        let bounds = relativeToElement.getBoundingClientRect();
        let left = bounds.left + relativeToElement.ownerDocument.defaultView.pageXOffset;
        return this.mouseEvent.pageX - left;
    }
    getY(relativeTo) {
        let relativeToElement = relativeTo.element;
        let bounds = relativeToElement.getBoundingClientRect();
        let top = bounds.top + relativeToElement.ownerDocument.defaultView.pageYOffset;
        return this.mouseEvent.pageY - top;
    }
    preventDefault() {
        this.mouseEvent.preventDefault();
    }
}
//# sourceMappingURL=BrowserMouseEventArgs.js.map