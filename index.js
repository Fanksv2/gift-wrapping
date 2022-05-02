import GiftsGenerator from "./GiftsGenerator.js";
import CanvasHelper from "./CanvasHelper.js";
import GiftWrapper from "./GiftWrapper.js";

const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
const canvasHelper = new CanvasHelper(ctx);

const gg = new GiftsGenerator(100, 150, 550);
const gifts = gg.generate();

gifts.forEach((gift) => {
    canvasHelper.point(gift.x, gift.y);
});

const giftWrapper = new GiftWrapper(10, 10, 0.1);

giftWrapper.run((wrapper) => canvasHelper.wrapper(wrapper));

// canvasHelper.wrapper([
//     { x: 100, y: 100 },
//     { x: 200, y: 100 },
//     { x: 200, y: 500 },
//     { x: 100, y: 200 },
// ]);
