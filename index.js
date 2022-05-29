import GiftsGenerator from "./GiftsGenerator.js";
import CanvasHelper from "./CanvasHelper.js";
import GiftWrapper from "./GiftWrapper.js";

const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector(".start");
const sliderGeneration = document.querySelector(".generations-slider");
const sliderIndividuals = document.querySelector(".individuals-slider");
const sliderMutation = document.querySelector(".mutation-rate-slider");
const sliderTime = document.querySelector(".time-slider");
const sliderArea = document.querySelector(".area-slider");

sliderGeneration.oninput = (e) => {
    updateSlider(sliderGeneration, ".generations");
};

sliderIndividuals.oninput = (e) => {
    updateSlider(sliderIndividuals, ".individuals");
};

sliderMutation.oninput = (e) => {
    updateSlider(sliderMutation, ".mutation-rate");
};

sliderTime.oninput = (e) => {
    updateSlider(sliderTime, ".time");
};

sliderArea.oninput = (e) => {
    updateSlider(sliderArea, ".area");
};

CanvasHelper.instantiate(ctx, canvas);

const gg = new GiftsGenerator(100, 150, 550);
const gifts = gg.generate();

gifts.forEach((gift) => {
    CanvasHelper.instance().point(gift.x, gift.y);
});

startButton.onclick = (e) => {
    startButton.disabled = true;
    const giftWrapper = new GiftWrapper(
        sliderGeneration.value,
        sliderIndividuals.value,
        sliderMutation.value / 100,
        sliderArea.value,
        gifts,
        100,
        600
    );
    giftWrapper.run(
        () => {
            return sliderTime.value;
        },
        () => {
            startButton.disabled = false;
        }
    );
};

function updateSlider(slider, elementClass) {
    var x = slider.value;
    document.querySelector(elementClass).innerHTML = x;
}
