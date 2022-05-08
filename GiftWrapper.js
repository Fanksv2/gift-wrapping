import CanvasHelper from "./CanvasHelper.js";

class GiftWrapper {
    constructor(
        generationsNumber,
        subjectsNumber,
        mutatingRate,
        gifts,
        xThreshold,
        yThreshold
    ) {
        this.generationsNumber = generationsNumber;
        this.mutatingRate = mutatingRate;
        this.subjectsNumber = subjectsNumber;
        this.generation = [];
        this.gifts = gifts;
        this.xThreshold = xThreshold;
        this.yThreshold = yThreshold;
    }
    pair(subjects) {
        let pairs = [];
        for (let i = 0; i < subjects.length; i++) {
            let subjectsWithoutElement = subjects.slice(0);
            subjectsWithoutElement.splice(i, 1);

            pairs.push([
                subjects[i].copy(),
                subjectsWithoutElement[
                    getRndInteger(0, subjectsWithoutElement.length - 1)
                ].copy(),
            ]);
        }
        return pairs;
    }
    crossover(pairs) {
        let subjects = [];
        for (let i = 0; i < pairs.length; i++) {
            let pos1 = getRndInteger(0, 4);
            let pos2 = getRndInteger(0, 4);

            let gen1 = pairs[i][0].vector()[pos1];
            let gen2 = pairs[i][1].vector()[pos2];

            pairs[i][0].setPoint(pos2, gen2);
            pairs[i][1].setPoint(pos1, gen1);

            subjects.push(pairs[i][0]);
            subjects.push(pairs[i][1]);
        }
        return subjects;
    }
    mutate(subjects) {
        for (let i = 0; i < subjects.length; i++) {
            let newSubject = subjects[i].copy();

            do {
                const mutateX = Math.random() < this.mutatingRate;
                const mutateY = Math.random() < this.mutatingRate;
                let pos = getRndInteger(0, 3);
                if (mutateX) {
                    newSubject.setPoint(pos, {
                        x: Wrapper.createRandomPoint(
                            this.xThreshold,
                            this.yThreshold
                        ).x,
                        y: newSubject.vector()[pos].y,
                    });
                }
                if (mutateY) {
                    newSubject.setPoint(pos, {
                        x: newSubject.vector()[pos].x,
                        y: Wrapper.createRandomPoint(
                            this.xThreshold,
                            this.yThreshold
                        ).y,
                    });
                }
            } while (newSubject.validate() === false);

            subjects[i] = newSubject;
        }
    }
    fitness(wrapper) {
        let area = Wrapper.calculateArea(wrapper);
        let pointsInsideCount = Wrapper.checkPoints(wrapper, this.gifts).length;
        let pointsCount = this.gifts.length;

        if (area > 30000) {
            return 0;
        }

        const score = (pointsInsideCount / pointsCount) * 100;
        return score;
    }

    fitall(subjects) {
        let scores = [];
        subjects.forEach((element) => {
            scores.push({
                subject: element,
                score: this.fitness(element),
            });
        });

        scores.sort((a, b) => {
            if (a.score > b.score) {
                return -1;
            } else if (b.score > a.score) {
                return 1;
            } else {
                return 0;
            }
        });

        return scores;
    }
    async run() {
        for (let i = 0; i < this.subjectsNumber; i++) {
            let wrapper = Wrapper.createRandom(
                this.xThreshold,
                this.yThreshold
            );
            this.generation.push(wrapper);
            //CanvasHelper.instance().wrapper(wrapper, i);
        }

        for (let i = 0; i < this.generationsNumber; i++) {
            let pairs = this.pair(this.generation);
            let newGeneration = this.crossover(pairs);
            this.mutate(newGeneration);
            let scores = this.fitall(newGeneration);
            this.generation = scores
                .map((element) => {
                    return element.subject;
                })
                .slice(0, this.subjectsNumber);
            console.log(scores[0].score);

            CanvasHelper.instance().clear();

            for (let j = 0; j < this.generation.length; j++) {
                CanvasHelper.instance().wrapper(this.generation[j], j);
            }

            this.gifts.forEach((gift) => {
                CanvasHelper.instance().point(gift.x, gift.y);
            });

            // CanvasHelper.instance().wrapper(newGeneration[0], i);
            // let pointsInsidePolygon = Wrapper.checkPoints(
            //     newGeneration[0],
            //     this.gifts
            // );
            // for (let j = 0; j < pointsInsidePolygon.length; j++) {
            //     CanvasHelper.instance().point(
            //         pointsInsidePolygon[j].x,
            //         pointsInsidePolygon[j].y,
            //         i,
            //         true
            //     );
            // }
        }

        console.log("Area: " + Wrapper.calculateArea(this.generation[0]));
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

    vector() {
        return [this.p1, this.p2, this.p3, this.p4];
    }

    setPoint(index, value) {
        switch (index) {
            case 0:
                this.p1 = value;
                break;
            case 1:
                this.p2 = value;
                break;
            case 2:
                this.p3 = value;
                break;
            case 3:
                this.p4 = value;
                break;
        }
    }

    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    centroid() {
        return Wrapper.calculateCentroid(this.p1, this.p2, this.p3, this.p4);
    }

    validate() {
        let points = [
            [this.p1.x, this.p1.y],
            [this.p2.x, this.p2.y],
            [this.p3.x, this.p3.y],
            [this.p4.x, this.p4.y],
        ];
        let oldPoints = JSON.parse(JSON.stringify(points));

        points = Wrapper.sortedPoints(points, this.centroid());

        return JSON.stringify(oldPoints) === JSON.stringify(points);
    }

    static checkPoints(wrapper, points) {
        let pointsInsidePolygon = [];
        let centroid = wrapper.centroid();

        let triangule1 = this.checkPointsInsideTriangule(
            points,
            centroid,
            wrapper.p2,
            wrapper.p1
        );
        let triangule2 = this.checkPointsInsideTriangule(
            points,
            centroid,
            wrapper.p3,
            wrapper.p2
        );
        let triangule3 = this.checkPointsInsideTriangule(
            points,
            centroid,
            wrapper.p4,
            wrapper.p3
        );
        let triangule4 = this.checkPointsInsideTriangule(
            points,
            centroid,
            wrapper.p1,
            wrapper.p4
        );

        pointsInsidePolygon.push(...triangule1);
        pointsInsidePolygon.push(...triangule2);
        pointsInsidePolygon.push(...triangule3);
        pointsInsidePolygon.push(...triangule4);

        return pointsInsidePolygon;
    }

    static checkPointsInsideTriangule(points, p1, p2, p3) {
        let pointsInsideTriangule = [];
        for (let i = 0; i < points.length; i++) {
            let area = this.calculateTrianguleArea(p1, p2, p3);
            let s =
                (1 / (2 * area)) *
                (p1.y * p3.x -
                    p1.x * p3.y +
                    (p3.y - p1.y) * points[i].x +
                    (p1.x - p3.x) * points[i].y);
            let t =
                (1 / (2 * area)) *
                (p1.x * p2.y -
                    p1.y * p2.x +
                    (p1.y - p2.y) * points[i].x +
                    (p2.x - p1.x) * points[i].y);

            if (s > 0 && t > 0 && 1 - s - t > 0) {
                pointsInsideTriangule.push(points[i]);
            }
        }
        return pointsInsideTriangule;
    }

    static calculateTrianguleArea(p1, p2, p3) {
        let area =
            0.5 *
            (-p2.y * p3.x +
                p1.y * (-p2.x + p3.x) +
                p1.x * (p2.y - p3.y) +
                p2.x * p3.y);
        return area;
    }

    static calculateArea(wrapper) {
        const centroid = wrapper.centroid();
        let area1 = this.calculateTrianguleArea(
            centroid,
            wrapper.p2,
            wrapper.p1
        );
        let area2 = this.calculateTrianguleArea(
            centroid,
            wrapper.p3,
            wrapper.p2
        );
        let area3 = this.calculateTrianguleArea(
            centroid,
            wrapper.p4,
            wrapper.p3
        );
        let area4 = this.calculateTrianguleArea(
            centroid,
            wrapper.p1,
            wrapper.p4
        );
        return (
            Math.abs(area1) +
            Math.abs(area2) +
            Math.abs(area3) +
            Math.abs(area4)
        );
    }

    static calculateCentroid(p1, p2, p3, p4) {
        let x = (p1.x + p2.x + p3.x + p4.x) / 4;
        let y = (p1.y + p2.y + p3.y + p4.y) / 4;
        return { x, y };
    }

    static createRandom(min, max) {
        let points = [];

        for (let i = 0; i < 4; i++) {
            points.push([getRndInteger(min, max), getRndInteger(min, max)]);
        }

        points = this.sortedPoints(
            points,
            this.calculateCentroid(
                {
                    x: points[0][0],
                    y: points[0][1],
                },
                {
                    x: points[1][0],
                    y: points[1][1],
                },
                {
                    x: points[2][0],
                    y: points[2][1],
                },
                {
                    x: points[3][0],
                    y: points[3][1],
                }
            )
        );

        return new Wrapper(
            { x: points[0][0], y: points[0][1] },
            { x: points[1][0], y: points[1][1] },
            { x: points[2][0], y: points[2][1] },
            { x: points[3][0], y: points[3][1] }
        );
    }
    static createRandomPoint(min, max) {
        return { x: getRndInteger(min, max), y: getRndInteger(min, max) };
    }
    static sortedPoints(points, centroid) {
        const centerPoint = [centroid.x, centroid.y];
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
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default GiftWrapper;
