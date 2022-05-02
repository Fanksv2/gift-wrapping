class CanvasHelper {
    constructor(context) {
        this.context = context;
    }

    point(x, y) {
        this.context.beginPath();
        this.context.ellipse(x, y, 2, 2, Math.PI / 4, 0, 2 * Math.PI);
        this.context.stroke();
    }

    wrapper(shape) {
        this.context.beginPath();

        this.context.moveTo(shape.p1.x, shape.p1.y);
        this.context.lineTo(shape.p2.x, shape.p2.y);
        this.context.lineTo(shape.p3.x, shape.p3.y);
        this.context.lineTo(shape.p4.x, shape.p4.y);

        this.context.closePath();
        this.context.stroke();
    }
}

export default CanvasHelper;
