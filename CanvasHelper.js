class CanvasHelper {
    constructor(context, canvas) {
        this.context = context;
        this.canvas = canvas;
    }

    static instantiate(context, canvas) {
        this.canvasHelper = new CanvasHelper(context, canvas);
    }

    static instance() {
        if (this.canvasHelper !== null) {
            return this.canvasHelper;
        }

        return undefined;
    }

    point(x, y, color, fill) {
        this.context.beginPath();
        this.context.ellipse(x, y, 2, 2, Math.PI / 4, 0, 2 * Math.PI);
        this.context.strokeStyle = this.calcColor(color, 10);
        if (fill) {
            this.context.fill();
        }
        this.context.stroke();
    }

    wrapper(shape, color) {
        this.context.beginPath();

        this.context.moveTo(shape.p4.x, shape.p4.y);
        this.context.lineTo(shape.p1.x, shape.p1.y);
        this.context.lineTo(shape.p2.x, shape.p2.y);
        this.context.lineTo(shape.p3.x, shape.p3.y);

        this.context.closePath();
        this.context.strokeStyle = this.calcColor(color, 10);
        this.context.stroke();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    calcColor(color, size) {
        var rainbow = new Array(size);

        var red = sin_to_hex(color, (0 * Math.PI * 2) / 3); // 0   deg
        var blue = sin_to_hex(color, (1 * Math.PI * 2) / 3); // 120 deg
        var green = sin_to_hex(color, (2 * Math.PI * 2) / 3); // 240 deg

        return "#" + red + green + blue;

        function sin_to_hex(i, phase) {
            var sin = Math.sin((Math.PI / size) * 2 * i + phase);
            var int = Math.floor(sin * 127) + 128;
            var hex = int.toString(16);

            return hex.length === 1 ? "0" + hex : hex;
        }
    }
}

export default CanvasHelper;
