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
                })
            });
        }
    }
    load(no, startgame) {
        this.currentLevel = {
            no,
            hero: []
        };
        this.scoreEl.innerText = `Score: ${this.score}`;
        assets.setOnLoad(startgame);
        const level = this.data[no];
        this.currentLevel.backgroundImage = assets.loadImg(`/images/backgrounds/${level.background}.png`);
        this.currentLevel.foregroundImage = assets.loadImg(`/images/backgrounds/${level.foreground}.png`);
        this.slingshotImage = assets.loadImg("/images/slingshot.png");
        this.slingshotFrontImage = assets.loadImg("/images/slingshot-front.png");
    }
}

export default new Levels();