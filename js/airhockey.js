const { Vec2, World, Edge, Circle } = planck;

class PlanckTest {
    constructor() {
        this.canvas = document.getElementById("canvas");
        if (!this.canvas) {
            throw new Error("missing canvas");
        }
    }
    buildTableMap() {
        let tableMap = [];
        const tableHeight = 42;
        const tableWidth = 24;
        const goalWidth = 8;
        const goalDepth = 3;
        const cornerRadius = 3;
        const cornerSteps = 5;
        const endLength = (tableWidth - goalWidth - cornerRadius * 2) / 2;
        // const sideLength = (tableHeight - cornerRadius * 2) / 2;
        const centerX = tableWidth / 2;
        const centerY = tableHeight / 2;

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: centerY,
            },
            {
                x: -(goalWidth / 2) - endLength,
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: centerY,
            },
            {
                x: goalWidth / 2 + endLength,
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: centerY + goalDepth,
            },
            {
                x: goalWidth / 2,
                y: centerY + goalDepth,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: centerY + goalDepth,
            },
            {
                x: -(goalWidth / 2),
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: centerY + goalDepth,
            },
            {
                x: goalWidth / 2,
                y: centerY,
            },
        ]);

        tableMap.push([
            {
                x: centerX,
                y: centerY - cornerRadius,
            },
            {
                x: centerX,
                y: -centerY + cornerRadius,
            },
        ]);

        tableMap.push([
            {
                x: -centerX,
                y: centerY - cornerRadius,
            },
            {
                x: -centerX,
                y: -centerY + cornerRadius,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: -centerY,
            },
            {
                x: -(goalWidth / 2) - endLength,
                y: -centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: -centerY,
            },
            {
                x: goalWidth / 2 + endLength,
                y: -centerY,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: -centerY - goalDepth,
            },
            {
                x: goalWidth / 2,
                y: -centerY - goalDepth,
            },
        ]);

        tableMap.push([
            {
                x: -(goalWidth / 2),
                y: -centerY - goalDepth,
            },
            {
                x: -(goalWidth / 2),
                y: -centerY,
            },
        ]);

        tableMap.push([
            {
                x: goalWidth / 2,
                y: -centerY - goalDepth,
            },
            {
                x: goalWidth / 2,
                y: -centerY,
            },
        ]);

        createCorner(
            {
                x: centerX,
                y: centerY,
            },
            {
                x: centerX - cornerRadius,
                y: centerY - cornerRadius,
            }
        );

        createCorner(
            {
                x: -centerX,
                y: centerY,
            },
            {
                x: -centerX + cornerRadius,
                y: centerY - cornerRadius,
            }
        );

        createCorner(
            {
                x: centerX,
                y: -centerY,
            },
            {
                x: centerX - cornerRadius,
                y: -centerY + cornerRadius,
            }
        );

        createCorner(
            {
                x: -centerX,
                y: -centerY,
            },
            {
                x: -centerX + cornerRadius,
                y: -centerY + cornerRadius,
            }
        );

        function createCorner(start, end) {
            let sum = 0;
            let map = [];
            const sizeX = end.x - start.x;
            const sizeY = end.y - start.y;

            for (let i = 0; i < cornerSteps + 1; i++) {
                sum += i;
                map.push(sum);
            }

            function stepWidth(index, size) {
                return (size / map[cornerSteps]) * map[index];
            }

            for (let i = 0; i < cornerSteps; i++) {
                const currentX = stepWidth(i, sizeX) + start.x;
                const currentY = stepWidth(cornerSteps - i, sizeY) + start.y;
                const nextX = stepWidth(i + 1, sizeX) + start.x;
                const nextY = stepWidth(cornerSteps - i - 1, sizeY) + start.y;
                tableMap.push([
                    { x: currentX, y: currentY },
                    { x: nextX, y: nextY },
                ]);
            }
        }

        return tableMap;
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
        this.draw();
        window.requestAnimationFrame(() => this.renderer());
    }
    draw() {
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
                        this.drawEdge(object);
                        break;
                    case "circle":
                        this.drawCircle(object);
                        break;
                    case "polygon":
                        this.drawPolygon(object);
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
    drawEdge(o) {
        const ctx = this.offscreenCtx;
        const shape = o.fixture.getShape();
        //const r = shape.getRadius();
        ctx.strokeStyle = o.color;
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
        ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
        ctx.stroke();
    }
    drawCircle(o) {
        const ctx = this.offscreenCtx;
        const shape = o.fixture.getShape();
        // const isActive = o.body.isActive();
        // console.log(`isActive=${isActive}`);
        const r = shape.getRadius();
        // const c = shape.getCenter();
        const pos = o.body.getPosition();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = "green";
        ctx.closePath();
        ctx.stroke();
    }
    drawPolygon(fix) {
        const ctx = this.offscreenCtx;
        const shape = fix.getShape();
        //const r = shape.getRadius();
        const numVerts = shape.m_vertices.length;
        if (numVerts === 0) throw new Error("No verticies?");

        ctx.fillStyle = "#f00";
        ctx.beginPath();
        const pos = fix.getBody().getPosition();
        const firstVert = shape.getVertex(0);
        ctx.moveTo(firstVert.x + pos.x, firstVert.y + pos.y);

        for (let i = 1; i < numVerts; i++) {
            const vert = shape.getVertex(i);
            ctx.lineTo(vert.x + pos.x, vert.y + pos.y);
        }
        ctx.closePath();
        ctx.fill();
    }
    initCanvas() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        // this.ctx.scale(15, 15);
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

        this.world = World();
        const table = this.world.createBody();
        const tableMap = this.buildTableMap();

        //Create Table Walls
        tableMap.map(function(edge) {
            table.createFixture(
                Edge(Vec2(edge[0].x, edge[0].y), Vec2(edge[1].x, edge[1].y))
            );
        });

        //Create Goal Detection Sensors
        const goalFixureDefinition = { isSensor: true, filterMaskBits: 0x0004 };
        this.goal1Sensor = table.createFixture(
            Edge(Vec2(-4, 22.5), Vec2(4, 22.5)),
            goalFixureDefinition
        );
        this.goal2Sensor = table.createFixture(
            Edge(Vec2(-4, -22.5), Vec2(4, -22.5)),
            goalFixureDefinition
        );

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

        this.renderer();
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
                let pad = paddle1;
                if (this.activePad == "pad2") pad = paddle2;

                pad.applyForce(vector, Vec2(pad.getPosition()), true);
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
                this.activePad = "pad1";
                this.activePadStartVec = getMouseTouchPos(e);
            } else if (isPaddleInside(pos2, radius, e)) {
                this.activePad = "pad2";
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
            this.activePad = null;
        };
        const touchMove = e => {
            if (this.activePad) {
                let pad = paddle1;
                if (this.activePad === "pad2") {
                    pad = paddle2;
                }
                const pos = getMouseTouchPos(e);
                const vector = Vec2(
                    -(this.activePadStartVec.x - pos.x) * this.force,
                    -(this.activePadStartVec.y - pos.y) * this.force
                );
                pad.applyForce(vector, Vec2(pad.getPosition()), true);
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
        this.canvas.addEventListener("dblclick", (e) => this.fullscreen(e));
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
