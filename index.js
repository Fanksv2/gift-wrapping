import GiftsGenerator from "./GiftsGenerator.js";
import CanvasHelper from "./CanvasHelper.js";
import GiftWrapper from "./GiftWrapper.js";

const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
CanvasHelper.instantiate(ctx, canvas);

const gg = new GiftsGenerator(100, 150, 550);
const gifts = gg.generate();

gifts.forEach((gift) => {
    CanvasHelper.instance().point(gift.x, gift.y);
});

const giftWrapper = new GiftWrapper(1000, 10, 0.15, gifts, 100, 600);
giftWrapper.run();

// canvasHelper.wrapper([
//     { x: 100, y: 100 },
//     { x: 200, y: 100 },
//     { x: 200, y: 500 },
//     { x: 100, y: 200 },
// ]);
