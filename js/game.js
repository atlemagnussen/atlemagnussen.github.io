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
            mode: "intro",
            slingshotX: 140,
            slingshotY: 280
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
        this.config.offsetLeft = 0;
        this.config.ended = false;
        this.animationFrame = window.requestAnimationFrame(() => {
            this.animate();
        }, this.canvas);
    }
    handlePanning() {
        this.config.offsetLeft += 1;
    }
    animate() {
        this.handlePanning();
        this.context.drawImage(this.currentLevel.backgroundImage, this.config.offsetLeft/4, 0, 640, 480, 0, 0, 640, 480);
        this.context.drawImage(this.currentLevel.foregroundImage, this.config.offsetLeft, 0, 640, 480, 0, 0, 640, 480);
        this.context.drawImage(levels.slingshotImage, this.config.slingshotX-this.config.offsetLeft, this.config.slingshotY);
        this.context.drawImage(levels.slingshotFrontImage, this.config.slingshotX-this.config.offsetLeft, this.config.slingshotY);

        if (!this.config.ended) {
            this.animationFrame = window.requestAnimationFrame(() => {
                this.animate();
            }, this.canvas);
        }
    }
}

export default new Game();
