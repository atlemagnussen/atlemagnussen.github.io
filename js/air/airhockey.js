import field from "./field.js";
import Draw from "./draw.js";

const { Vec2, World, Edge, Circle } = planck;

class PlanckTest {
    constructor() {
        this.canvas = document.getElementById("canvas");
        if (!this.canvas) {
            throw new Error("missing canvas");
        }
        this.staticObjects = [];
        this.dynamicObjects = [];
    }
    renderer() {
        const dt = 1 / 60;
        const world = this.world;
        const now = Date.now();
        var elapsed = now - this.lastUpdate;
        this.lastUpdate = now;
        this.ctx.clearRect(
            -this.canvas.width / 2,
            -this.canvas.height / 2,
            this.canvas.width,
            this.canvas.height
        );
        this.fillCanvasBackground();

        world.step(dt, elapsed / 1000);
        this.drawDynamic();
        window.requestAnimationFrame(() => this.renderer());
    }
    drawDynamic() {
        for (var body = this.world.getBodyList(); body; body = body.getNext()) {
            for (
                var fixture = body.getFixtureList();
                fixture;
                fixture = fixture.getNext()
            ) {
                const type = fixture.getType();
                const object = {
                    type,
                    body,
                    fixture,
                    color: "white",
                };
                switch (object.type) {
                    case "edge":
                        this.draw.edge(object);
                        break;
                    case "circle":
                        this.draw.circle(object);
                        break;
                    case "polygon":
                        this.draw.polygon(object);
                        break;
                    case "text":
                        this.draw.text(object);
                        break;
                    default:
                        console.log(object.type);
                        break;
                }
            }
        }

        this.ctx.drawImage(
            this.offscreenCanvas,
            -this.canvas.width / 2,
            -this.canvas.height / 2
        );
    }
    
    initCanvas() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    }
    fillCanvasBackground() {
        this.offscreenCtx.fillStyle = "black";
        this.offscreenCtx.fillRect(
            -this.canvas.width / 2,
            -this.canvas.height / 2,
            this.canvas.width,
            this.canvas.height
        );
    }
    createOffScreenCanvas() {
        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.offscreenCtx.translate(
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        this.offscreenCtx.scale(this.scale, this.scale);
    }
    main() {
        this.scale = 15;
        this.canMove = false;
        this.force = 50;
        this.initCanvas();
        this.createOffScreenCanvas();
        this.fillCanvasBackground();
        this.draw = new Draw(this.offscreenCtx);
        this.world = World();
        this.createField();

        this.renderer();
    }
    createField() {
        const table = this.world.createBody();
        const tableMap = field.buildTableMap();

        //Create Table Walls
        tableMap.map(edge => {
            const fixture = table.createFixture(
                Edge(Vec2(edge.from.x, edge.from.y), Vec2(edge.to.x, edge.to.y))
            );
            // this.staticObjects.push({
            //     type: "edge",
            //     body: table,
            //     fixture,
            // });
        });

        //Create Goal Detection Sensors
        const goalFixureDefinition = { isSensor: true, filterMaskBits: 0x0004 };
        this.goal1Sensor = table.createFixture(
            Edge(Vec2(-4, 22.5), Vec2(4, 22.5)),
            goalFixureDefinition
        );
        // this.staticObjects.push({
        //     type: "edge",
        //     body: table,
        //     fixture: this.goal1Sensor,
        // });
        this.goal2Sensor = table.createFixture(
            Edge(Vec2(-4, -22.5), Vec2(4, -22.5)),
            goalFixureDefinition
        );
        // this.staticObjects.push({
        //     type: "edge",
        //     body: table,
        //     fixture: this.goal2Sensor,
        // });
        //Create Paddle Blocking Walls
        table.createFixture(Edge(Vec2(-4, 21), Vec2(4, 21)), {
            filterMaskBits: 0x0002,
        });
        table.createFixture(Edge(Vec2(-4, -21), Vec2(4, -21)), {
            filterMaskBits: 0x0002,
        });
        table.createFixture(Edge(Vec2(-12, 0), Vec2(12, 0)), {
            filterMaskBits: 0x0002,
        });

        this.createPuckAndPaddles();
        this.world.on("begin-contact", e => this.handleContact(e));
    }
    handleContact(contact) {
        const fixtureA = contact.getFixtureA();
        //const fixtureB = contact.getFixtureB();
        if (fixtureA == this.goal1Sensor) {
            this.alertGoal("player1");
            this.world.destroyBody(this.puck);
        }
        if (fixtureA == this.goal2Sensor) {
            this.alertGoal("player2");
            this.world.destroyBody(this.puck);
        }
    }
    createPuckAndPaddles() {
        this.puck = this.world.createBody({
            type: "dynamic",
            position: Vec2(0, 0),
            bullet: true,
            linearDamping: 0.1,
            angularDamping: 0.02,
        });
        this.puck.createFixture(Circle(1), {
            density: 0.25,
            restitution: 0.9,
            filterCategoryBits: 0x0004,
        });

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
        const paddle1 = this.world.createBody(
            paddleBodyDefinition(Vec2(0, 16))
        );
        paddle1.createFixture(Circle(1.5), paddleFixtureDefinition);
        const paddle2 = this.world.createBody(
            paddleBodyDefinition(Vec2(0, -16))
        );
        paddle2.createFixture(Circle(1.5), paddleFixtureDefinition);

        const updatePosition = e => {
            if (this.activePad) {
                const vector = Vec2(
                    e.movementX * this.force,
                    e.movementY * this.force
                );

                this.activePad.applyForce(
                    vector,
                    Vec2(this.activePad.getPosition()),
                    true
                );
            }
        };
        const scaleVec = vec => {
            return Vec2(vec.x * this.scale, vec.y * this.scale);
        };

        const isPaddleInside = (pos, r, e) => {
            const mt = e.clientX ? e : e.touches[0];

            const x = mt.clientX - this.canvas.width / 2;
            const y = mt.clientY - this.canvas.height / 2;
            const y1 = y > pos.y - r;
            const y2 = y < pos.y + r;
            const x1 = x > pos.x - r;
            const x2 = x < pos.x + r;
            return y1 && y2 && x1 && x2;
        };
        const checkPaddle = e => {
            const pos1 = scaleVec(paddle1.getPosition());
            const pos2 = scaleVec(paddle2.getPosition());
            const radius =
                paddle1
                    .getFixtureList()
                    .getShape()
                    .getRadius() * this.scale;
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
        const touchMove = e => {
            if (this.activePad) {
                const pos = getMouseTouchPos(e);
                const vector = Vec2(
                    -(this.activePadStartVec.x - pos.x) * this.force,
                    -(this.activePadStartVec.y - pos.y) * this.force
                );
                this.activePad.applyForce(
                    vector,
                    Vec2(this.activePad.getPosition()),
                    true
                );
                this.activePadStartVec = Vec2(pos.x, pos.y);
            }
            e.preventDefault();
        };

        //const unlock = () => { this.canMove = document.pointerLockElement === document.body ? true : false; };

        //document.addEventListener("pointerlockchange", () => unlock());
        document.addEventListener("mousedown", e => checkPaddle(e));
        this.canvas.addEventListener("touchstart", e => checkPaddle(e));

        window.addEventListener("mousemove", e => updatePosition(e));
        this.canvas.addEventListener("touchmove", e => touchMove(e));

        document.addEventListener("mouseup", e => releasePaddle(e));
        document.addEventListener("mouseout", e => releasePaddle(e));

        this.canvas.addEventListener("touchend", e => releasePaddle(e));
        this.canvas.addEventListener("touchcancel", e => releasePaddle(e));
        //document.body.addEventListener("click", () =>
        //    document.body.requestPointerLock()
        //);
        window.addEventListener("resize", e => this.resizeCanvas(e));
        this.canvas.addEventListener("dblclick", e => this.fullscreen(e));
    }
    resizeCanvas() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.offscreenCtx.translate(
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        this.offscreenCtx.scale(this.scale, this.scale);
    }
    alertGoal(scorer) {
        const txt = `${scorer} scored!`;
        console.log(txt);
        const ctx = this.offscreenCtx;
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(
            "Hello World",
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.fillText(txt, 10, 50);
    }
    fullscreen() {
        const elem = this.canvas;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }
    }
}

export default new PlanckTest();
