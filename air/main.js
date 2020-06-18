import canvas from "./canvas.js";
import config from "./config.js";
import draw from "./draw.js";

const { Vec2, World, Edge, Circle } = planck;

class PlanckTest {
    constructor() {
        this.dynamicObjects = [];
        this.score = {
            p1: 0,
            p2: 0,
        };
    }
    renderer() {
        const dt = 1 / 60;
        const world = this.world;
        const now = Date.now();
        var elapsed = now - this.lastUpdate;
        this.lastUpdate = now;
        world.step(dt, elapsed / 1000);
        if (this.puck.reset) {
            this.puck.setPosition(Vec2(0, 0));
            this.puck.setStatic();
            this.puck.setDynamic();
            this.puck.reset = false;
        }
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.offscreenCtx.clearRect(-w / 2, -h / 2, w, h);
        this.drawDynamic();
        window.requestAnimationFrame(() => this.renderer());
    }
    drawDynamic() {
        for (let i = 0; i < this.dynamicObjects.length; i++) {
            const object = this.dynamicObjects[i];
            draw.draw(this.offscreenCtx, object);
        }
        canvas.updateGame(this.offscreenCanvas);
    }

    createOffScreenCanvas() {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCanvas.width = w;
        this.offscreenCanvas.height = h;
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.offscreenCtx.translate(w / 2, h / 2);
        this.offscreenCtx.scale(config.scale, config.scale);
    }
    init() {
        canvas.init();
        this.createOffScreenCanvas();
        this.world = World();
        this.createField();
        this.renderer();
    }
    createField() {
        const table = this.world.createBody();

        //Create Goal Detection Sensors
        const goalFixureDefinition = { isSensor: true, filterMaskBits: 0x0004 };
        this.goal1Sensor = table.createFixture(Edge(Vec2(-4, 22.5), Vec2(4, 22.5)), goalFixureDefinition);
        this.goal2Sensor = table.createFixture(Edge(Vec2(-4, -22.5), Vec2(4, -22.5)), goalFixureDefinition);
        const statics = [this.goal1Sensor, this.goal2Sensor];
        //Create Paddle Blocking Walls
        statics.push(
            table.createFixture(Edge(Vec2(-4, 21), Vec2(4, 21)), {
                filterMaskBits: 0x0002,
            })
        );
        statics.push(
            table.createFixture(Edge(Vec2(-4, -21), Vec2(4, -21)), {
                filterMaskBits: 0x0002,
            })
        );
        statics.push(
            table.createFixture(Edge(Vec2(-12, 0), Vec2(12, 0)), {
                filterMaskBits: 0x0002,
            })
        );

        canvas.initBackground(table, statics, this.score);
        this.createPuck();
        this.createPaddles();
        this.world.on("begin-contact", e => this.handleContact(e));
    }
    handleContact(contact) {
        const fixtureA = contact.getFixtureA();
        //const fixtureB = contact.getFixtureB();
        if (fixtureA == this.goal1Sensor) {
            this.score.p1 += 1;
            this.alertGoal("player1");
        }
        if (fixtureA == this.goal2Sensor) {
            this.score.p2 += 1;
            this.alertGoal("player2");
        }
    }
    createPuck() {
        this.puck = this.world.createBody({
            type: "dynamic",
            position: Vec2(0, 0),
            bullet: true,
            linearDamping: 0.1,
            angularDamping: 0.02,
        });
        const puckFixture = this.puck.createFixture(Circle(1), {
            density: 0.25,
            restitution: 0.9,
            filterCategoryBits: 0x0004,
        });

        this.dynamicObjects.push({
            type: "circle",
            body: this.puck,
            fixture: puckFixture,
            color: "green",
        });
    }
    createPaddles() {
        //Create Paddles
        const paddleBodyDefinition = position => ({
            type: "dynamic",
            position: position,
            bullet: false,
            linearDamping: 10,
            angularDamping: 1,
        });
        const paddleFixtureDefinition = {
            restitution: 0,
            filterCategoryBits: 0x0002,
        };
        const paddle1 = this.world.createBody(paddleBodyDefinition(Vec2(0, 16)));
        const paddle1Fix = paddle1.createFixture(Circle(1.5), paddleFixtureDefinition);

        this.dynamicObjects.push({
            type: "circle",
            body: paddle1,
            fixture: paddle1Fix,
            color: "green",
        });

        const paddle2 = this.world.createBody(paddleBodyDefinition(Vec2(0, -16)));
        const paddle2Fix = paddle2.createFixture(Circle(1.5), paddleFixtureDefinition);

        this.dynamicObjects.push({
            type: "circle",
            body: paddle2,
            fixture: paddle2Fix,
            color: "green",
        });

        const scaleVec = vec => {
            return Vec2(vec.x * config.scale, vec.y * config.scale);
        };

        const isPaddleInside = (pos, r, e) => {
            const can = this.offscreenCanvas;
            const mts = e.clientX ? [e] : e.touches;
            for (let i = 0; i < mts.length; i++) {
                const mt = mts[i];
                const x = mt.clientX - can.width / 2;
                const y = mt.clientY - can.height / 2;
                const y1 = y > pos.y - r;
                const y2 = y < pos.y + r;
                const x1 = x > pos.x - r;
                const x2 = x < pos.x + r;
                const isin = y1 && y2 && x1 && x2;
                if (isin) return true;
            }
            return false;
        };
        const checkPaddle = e => {
            const pos1 = scaleVec(paddle1.getPosition());
            const pos2 = scaleVec(paddle2.getPosition());
            const radius =
                paddle1
                    .getFixtureList()
                    .getShape()
                    .getRadius() * config.scale;
            if (isPaddleInside(pos1, radius, e)) {
                this.activePad = paddle1;
                this.activePad.selected = true;
                this.activePadStartVec = getMouseTouchPos(e);
            } else if (isPaddleInside(pos2, radius, e)) {
                this.activePad = paddle2;
                this.activePad.selected = true;
                this.activePadStartVec = getMouseTouchPos(e);
            } else {
                this.activePad = null;
            }
        };
        const getMouseTouchPos = e => {
            const mt = e.clientX ? e : e.touches[0];
            const x = mt.clientX;
            const y = mt.clientY;
            return Vec2(x, y);
        };
        const releasePaddle = () => {
            if (this.activePad) {
                this.activePad.selected = false;
            }
            this.activePad = null;
        };
        const updatePosition = e => {
            if (this.activePad) {
                const vector = Vec2(e.movementX * config.force, e.movementY * config.force);
                this.activePad.applyForce(vector, Vec2(this.activePad.getPosition()), true);
            }
        };
        const touchMove = e => {
            if (this.activePad) {
                const pos = getMouseTouchPos(e);
                const x = -(this.activePadStartVec.x - pos.x);
                const y = -(this.activePadStartVec.y - pos.y);
                const vector = Vec2(x * config.force, y * config.force);
                console.log(`x=${x}, y=${y}, force=${config.force}`);
                this.activePad.applyForce(vector, Vec2(this.activePad.getPosition()), true);
                this.activePadStartVec = Vec2(pos.x, pos.y);
            }
            e.preventDefault();
        };

        document.body.addEventListener("mousedown", e => checkPaddle(e));
        window.addEventListener("mousemove", e => updatePosition(e));
        document.body.addEventListener("mouseup", e => releasePaddle(e));
        document.body.addEventListener("mouseout", e => releasePaddle(e));

        const gameEl = canvas.uiCanvas;
        gameEl.addEventListener("touchstart", e => checkPaddle(e));
        gameEl.addEventListener("touchmove", e => touchMove(e));
        gameEl.addEventListener("touchend", e => releasePaddle(e));
        gameEl.addEventListener("touchcancel", e => releasePaddle(e));

        window.addEventListener("resize", e => this.resizeOffscreenCanvas(e));
    }
    resizeOffscreenCanvas() {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.offscreenCanvas.width = w;
        this.offscreenCanvas.height = h;
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.offscreenCtx.translate(w / 2, h / 2);
        this.offscreenCtx.scale(config.scale, config.scale);
    }
    alertGoal(scorer) {
        const txt = `${scorer} scored!`;
        console.log(txt);
        canvas.flashText(txt);
        this.puck.reset = true;
    }
}

export default new PlanckTest();
