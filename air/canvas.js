import config from "./config.js";
import draw from "./draw.js";
import field from "./field.js";
const { Vec2, World, Edge, Circle } = planck;

class Canvas {
    constructor() {
        this.wrapper = document.getElementById("game-wrapper");
        this.background = document.getElementById("background");
        this.backgroundCtx = this.background.getContext("2d");
        this.game = document.getElementById("game");
        this.gameCtx = this.game.getContext("2d");
        this.ui = document.getElementById("ui");
        this.uiCtx = this.ui.getContext("2d");
        this.staticObjects = [];
    }
    get gameCanvas() {
        return this.game;
    }
    get uiCanvas() {
        return this.ui;
    }
    init() {
        this.resizeCanvas(true);
        this.scale(this.backgroundCtx);
        window.addEventListener("resize", () => this.resizeCanvas());
        document.addEventListener("dblclick", e => this.fullscreen(e));
    }
    setSize(ctx, w, h) {
        ctx.width = w;
        ctx.height = h;
    }
    center(ctx, w, h) {
        ctx.translate(w / 2, h / 2);
    }
    scale(ctx) {
        ctx.scale(config.scale, config.scale);
    }
    resizeCanvas(init) {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.setSize(this.background, w, h);
        this.center(this.backgroundCtx, w, h);
        this.setSize(this.game, w, h);
        this.center(this.gameCtx, w, h);
        this.setSize(this.ui, w, h);
        this.center(this.uiCtx, w, h);
        if (!init) {
            this.scale(this.backgroundCtx);
            this.setBackground();
        }
    }
    initBackground(table, statics) {
        const tableMap = field.buildTableMap();

        tableMap.map(edge => {
            const fixture = table.createFixture(Edge(Vec2(edge.from.x, edge.from.y), Vec2(edge.to.x, edge.to.y)));
            this.staticObjects.push({
                type: "edge",
                body: table,
                fixture,
                color: "white",
            });
        });
        for (let i = 0; i < statics.length; i++) {
            this.staticObjects.push({
                type: "edge",
                body: table,
                fixture: statics[i],
                color: "white",
            });
        }
        this.setBackground();
    }
    setBackground() {
        this.setBackgroundColor();
        this.drawTable();
    }
    setBackgroundColor() {
        const w = this.background.width,
            h = this.background.height;
        const ctx = this.backgroundCtx;
        ctx.clearRect(-w / 2, -h / 2, w, h);
        ctx.fillStyle = "black";
        ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    drawTable() {
        for (let i = 0; i < this.staticObjects.length; i++) {
            const o = this.staticObjects[i];
            draw.draw(this.backgroundCtx, o);
        }
    }
    updateGame(ctxBuf) {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.gameCtx.clearRect(-w / 2, -h / 2, w, h);
        this.gameCtx.drawImage(ctxBuf, -this.game.width / 2, -this.game.height / 2);
    }
    fullscreen() {
        const el = this.wrapper;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
            /* Firefox */
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            /* IE/Edge */
            el.msRequestFullscreen();
        }
    }
    unflashText() {
        this.textField.visible = false;
        this.setBackground();
    }
    flashText(txt) {
        if (this.textField) {
            this.textField.text = txt;
            this.textField.visible = true;
        } else {
            this.textField = {
                type: "text",
                text: txt,
                pos: {
                    x: -7,
                    y: -1,
                },
                visible: true,
                color: "white",
            };
            this.staticObjects.push(this.textField);
        }
        this.setBackground();
        setTimeout(() => this.unflashText(), 5000);
    }
}

export default new Canvas();
