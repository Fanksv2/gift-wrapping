class GiftsGenerator {
    constructor(amount, min, max) {
        this.amount = amount;
        this.min = min;
        this.max = max;
    }

    generate() {
        let points = [];
        for (let i = 0; i < this.amount; i++) {
            points.push({
                x: this.getRndInteger(this.min, this.max),
                y: this.getRndInteger(this.min, this.max),
            });
        }
        return points;
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default GiftsGenerator;
