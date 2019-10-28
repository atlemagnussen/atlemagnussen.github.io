import assets from "./assets.js";
import levels from "./levels.js";
import wiz from "./wizard.js";


class Game {
    constructor() {
        this.init();
        assets.init();
    }

    init() {
        this.gameLayerEls = document.querySelectorAll(".gamelayer");
        this.gameStartScreen = document.getElementById("gamestartscreen");
        this.canvas = document.getElementById("gamecanvas");
        this.context = this.canvas.getContext("2d");
        this.levelselectscreen = document.getElementById("levelselectscreen");
        wiz.show(this.gameStartScreen);
        levels.drawLevels(this.levelselectscreen);
        this.initBtns();
    }
    initBtns() {
        this.playgameBtn = document.getElementById("playgame");
        this.playgameBtn.addEventListener("click", () => {
            this.play();
        });
    }
    play() {
        wiz.hide(this.gameLayerEls);
        wiz.show(this.levelselectscreen);
    }
}

export default new Game();
