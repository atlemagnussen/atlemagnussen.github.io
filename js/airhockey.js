const { Vec2, World, Edge, Circle, Box } = planck;

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
        const r = shape.getRadius();
        ctx.strokeStyle = o.color;
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
        ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
        ctx.stroke();
    }
    drawCircle(o, i) {
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
        const r = shape.getRadius();
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
        this.offscreenCtx.scale(15, 15);
    }
    main() {
        this.initCanvas();
        this.createOffScreenCanvas();
        this.fillCanvasBackground();

        let canMove = false;
        const force = 100;
        const pl = planck;
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
            if (canMove) {
                const vector = Vec2(e.movementX * force, -e.movementY * force);
                paddle2.applyForce(vector, Vec2(paddle2.getPosition()), true);
            }
        };

        const unlock = () => {
            canMove =
                document.pointerLockElement === document.body ? true : false;
        };

        document.addEventListener("pointerlockchange", () => unlock());
        window.addEventListener("mousemove", e => updatePosition(e));
        document.body.addEventListener("click", () =>
            document.body.requestPointerLock()
        );
        this.world.on("begin-contact", e => this.handleContact(e));

        this.renderer();
    }
    handleContact(contact) {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        if (fixtureA == this.goal1Sensor) {
            this.alertGoal("player1");
            this.world.destroyBody(this.puck);
        }
        if (fixtureA == this.goal2Sensor) {
            this.alertGoal("player2");
            this.world.destroyBody(this.puck);
        }
    }
    alertGoal(scorer) {
        const txt = `${scorer} scored!`;
        console.log(txt);
    }
}

export default new PlanckTest();
