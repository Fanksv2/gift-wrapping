class GiftWrapper {
    constructor(generationsNumber, subjectsNumber, mutatingRate) {
        this.generationsNumber = generationsNumber;
        this.mutatingRate = mutatingRate;
        this.subjectsNumber = subjectsNumber;
        this.generation = [];
    }
    fitness() {}
    crossover() {}
    mutate() {}
    async run(callback) {
        for (var i = 0; i < this.subjectsNumber; i++) {
            var wrapper = Wrapper.createRandom(100, 600);
            this.generation.push(wrapper);
            callback(wrapper);
            await sleep(1000);
        }

        for (var i = 0; i < this.generationsNumber; i++) {}
    }
}

async function sleep(msec) {
    return new Promise((resolve) => setTimeout(resolve, msec));
}

class Wrapper {
    constructor(p1, p2, p3, p4) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
    }
    static createRandom(min, max) {
        var points = [];

        for (var i = 0; i < 4; i++) {
            points.push([getRndInteger(min, max), getRndInteger(min, max)]);
        }

        points = Wrapper.sortedPoints(points, 700, 700);

        return new Wrapper(
            { x: points[0][0], y: points[0][1] },
            { x: points[1][0], y: points[1][1] },
            { x: points[2][0], y: points[2][1] },
            { x: points[3][0], y: points[3][1] }
        );
    }
    static sortedPoints(points, width, height) {
        const centerPoint = [width / 2, height / 2];
        const sorted = points.slice(0);

        const sortByAngle = (p1, p2) => {
            return (
                (Math.atan2(p1[1] - centerPoint[1], p1[0] - centerPoint[0]) *
                    180) /
                    Math.PI -
                (Math.atan2(p2[1] - centerPoint[1], p2[0] - centerPoint[0]) *
                    180) /
                    Math.PI
            );
        };

        sorted.sort(sortByAngle);
        return sorted;
    }

    static v;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default GiftWrapper;
