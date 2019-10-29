import assets from "./assets.js";
import levels from "./levels.js";
import wiz from "./wizard.js";
import mouse from "./mouse.js";


class Game {
    constructor() {
        this.init();
        assets.init();
        mouse.init();
        this.config = {
            slingshotX: 140,
            slingshotY: 280,
            maxSpeed: 3,
            minOffset: 0,
            maxOffset: 300
        };
        this.state = {
            mode: "intro",
            offsetLeft: 0,
            score: 0
        };
    }

    init() {
        this.gameLayerElements = document.querySelectorAll(".gamelayer");
        this.gameStartScreen = document.getElementById("gamestartscreen");
        this.scoreScreen = document.getElementById("scorescreen");
        this.canvas = document.getElementById("gamecanvas");
        this.context = this.canvas.getContext("2d");
        this.levelselectscreen = document.getElementById("levelselectscreen");
        wiz.show(this.gameStartScreen);
        levels.drawLevels(this.levelselectscreen);
        this.initBtns();
        document.addEventListener("startGame", async () => {
            this.start();
        });
    }
    initBtns() {
        this.playgameBtn = document.getElementById("playgame");
        this.playgameBtn.addEventListener("click", () => {
            this.play();
        });
    }
    play() {
        wiz.hide(this.gameLayerElements);
        wiz.show(this.levelselectscreen);
    }
    start() {
        this.currentLevel = levels.currentLevel;
        wiz.hide(this.gameLayerElements);
        wiz.show(this.canvas);
        wiz.show(this.scoreScreen);
        this.state.offsetLeft = 0;
        this.state.ended = false;
        this.animationFrame = window.requestAnimationFrame(() => {
            this.animate();
        }, this.canvas);
    }
    panTo(newCenter) {
        if (Math.abs(newCenter-this.state.offsetLeft-this.canvas.width/4) > 0
        && this.state.offsetLeft <= this.config.maxOffset
        && this.state.offsetLeft >= this.config.minOffset) {
            let deltaX = Math.round((newCenter-this.state.offsetLeft-this.canvas.width/4)/2);
            if(deltaX && Math.abs(deltaX) > this.config.maxSpeed) {
                deltaX = this.config.maxSpeed*Math.abs(deltaX)/deltaX;
            }
            this.state.offsetLeft += deltaX;
        } else {
            return true;
        }
        if (this.state.offsetLeft < this.config.minOffset) {
            this.state.offsetLeft = this.config.minOffset;
            return true;
        } else if (this.state.offsetLeft > this.config.maxOffset) {
            this.state.offsetLeft = this.config.maxOffset;
            return true;
        }
        return false;
    }
    handlePanning() {
        if (this.state.mode === "intro") {
            if (this.panTo(700)) {
                this.state.mode = "load-next-hero";
            }
        }
        if (this.state.mode === "wait-for-firing") {
            if (mouse.state.dragging) {
                this.panTo(mouse.state.x + this.state.offsetLeft);
            } else {
                this.panTo(this.config.slingshotX);
            }
        }
        if (this.state.mode === "load-next-hero") {
            console.log("todo load next");
        }
        if (this.state.mode === "firing") {
            this.panTo(this.config.slingshotX);
        }
        if (this.state.mode === "fired") {
            console.log("todo fired");
        }
    }
    animate() {
        this.handlePanning();
        this.context.drawImage(this.currentLevel.backgroundImage, this.state.offsetLeft/4, 0, 640, 480, 0, 0, 640, 480);
        this.context.drawImage(this.currentLevel.foregroundImage, this.state.offsetLeft, 0, 640, 480, 0, 0, 640, 480);
        this.context.drawImage(levels.slingshotImage, this.config.slingshotX-this.state.offsetLeft, this.config.slingshotY);
        this.context.drawImage(levels.slingshotFrontImage, this.config.slingshotX-this.state.offsetLeft, this.config.slingshotY);

        if (!this.state.ended) {
            this.animationFrame = window.requestAnimationFrame(() => {
                this.animate();
            }, this.canvas);
        }
    }
}

export default new Game();
