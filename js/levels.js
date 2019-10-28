import assets from "./assets.js";

class Levels {
    constructor() {
        this.data = [
            {
                foreground: "desert-foreground",
                background: "clouds-background",
                entities: []
            },
            {
                foreground: "desert-foreground",
                background: "clouds-background",
                entities: []
            }
        ];
        this.scoreEl = document.getElementById("score");
    }

    drawLevels(mainEl) {
        for(let i = 0; i<this.data.length; i++) {
            const btn = document.createElement("input");
            btn.type = "button";
            btn.value = `${i+1}`;
            const val = i;
            mainEl.appendChild(btn);
            btn.addEventListener("click", () => {
                this.load(val, () => {
                    console.log(`start level ${val}`);
                    document.dispatchEvent(new CustomEvent("startGame", {"detail": { val } } ));
                });
            });
        }
    }
    load(no, startgame) {
        this._currentLevel = {
            no,
            hero: []
        };
        this.score = 0;
        this.scoreEl.innerText = `Score: ${this.score}`;
        assets.setOnLoad(startgame);
        const level = this.data[no];
        this._currentLevel.backgroundImage = assets.loadImg(`/images/backgrounds/${level.background}.png`);
        this._currentLevel.foregroundImage = assets.loadImg(`/images/backgrounds/${level.foreground}.png`);
        this._slingshotImage = assets.loadImg("/images/slingshot.png");
        this._slingshotFrontImage = assets.loadImg("/images/slingshot-front.png");
    }
    get currentLevel() {
        return this._currentLevel;
    }
    get slingshotImage() {
        return this._slingshotImage;
    }
    get slingshotFrontImage() {
        return this._slingshotFrontImage;
    }
}

export default new Levels();