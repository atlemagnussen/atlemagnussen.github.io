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
        const dt = 1 / 60.0;
        const world = this.world;

        world.step(dt);
        for (var body = world.getBodyList(); body; body = body.getNext()) {
            for (
                var fixture = body.getFixtureList();
                fixture;
                fixture = fixture.getNext()
            ) {
                const type = fixture.getType();
                switch (type) {
                    case "edge":
                        this.drawEdge(fixture);
                        break;
                    case "circle":
                        this.drawCircle(fixture);
                        break;
                    default:
                        break;
                }
            }
        }
        window.requestAnimationFrame(() => this.renderer());
    }
    drawEdge(fix) {
        const shape = fix.getShape();
        const r = shape.getRadius();
    }
    drawCircle(fix) {
        const ctx = this.ctx;
        const shape = fix.getShape();
        const r = shape.getRadius();
        const c = shape.getCenter();
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, 2 * Math.PI, false);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#003300";
        ctx.stroke();
    }
    fullScreenCanvas() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }
    fillCanvas() {
        const ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    main() {
        this.fullScreenCanvas();
        this.fillCanvas();
        this.ctx = this.canvas.getContext("2d");
        let canMove = false;
        const force = 100;
        const pl = planck;
        const Vec2 = pl.Vec2;
        this.world = pl.World();
        const table = this.world.createBody();
        const tableMap = this.buildTableMap();

        //Create Table Walls
        tableMap.map(function(edge) {
            table.createFixture(
                pl.Edge(Vec2(edge[0].x, edge[0].y), Vec2(edge[1].x, edge[1].y))
            );
        });

        //Create Goal Detection Sensors
        const goalFixureDefinition = { isSensor: true, filterMaskBits: 0x0004 };
        const goal1Sensor = table.createFixture(
            pl.Edge(Vec2(-4, 22.5), Vec2(4, 22.5)),
            goalFixureDefinition
        );
        const goal2Sensor = table.createFixture(
            pl.Edge(Vec2(-4, -22.5), Vec2(4, -22.5)),
            goalFixureDefinition
        );

        //Create Paddle Blocking Walls
        table.createFixture(pl.Edge(Vec2(-4, 21), Vec2(4, 21)), {
            filterMaskBits: 0x0002,
        });
        table.createFixture(pl.Edge(Vec2(-4, -21), Vec2(4, -21)), {
            filterMaskBits: 0x0002,
        });
        table.createFixture(pl.Edge(Vec2(-12, 0), Vec2(12, 0)), {
            filterMaskBits: 0x0002,
        });

        //Create Puck
        const puck = this.world.createBody({
            type: "dynamic",
            position: Vec2(0, 0),
            bullet: true,
            linearDamping: 0.1,
            angularDamping: 0.02,
        });
        puck.createFixture(pl.Circle(1), {
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
        paddle1.createFixture(pl.Circle(1.5), paddleFixtureDefinition);
        const paddle2 = this.world.createBody(
            paddleBodyDefinition(Vec2(0, -16))
        );
        paddle2.createFixture(pl.Circle(1.5), paddleFixtureDefinition);

        function updatePosition(e) {
            if (canMove) {
                const vector = Vec2(e.movementX * force, -e.movementY * force);
                paddle2.applyForce(vector, Vec2(paddle2.getPosition()), true);
            }
        }

        function handleContact(contact) {
            const fixtureA = contact.getFixtureA();
            const fixtureB = contact.getFixtureB();
            if (fixtureA == goal1Sensor) {
                alertGoal("player1");
                this.world.destroyBody(puck);
            }
            if (fixtureA == goal2Sensor) {
                alertGoal("player2");
                this.world.destroyBody(puck);
            }
        }

        function alertGoal(scorer) {
            const txt = `${scorer} scored!`;
            console.log(txt);
        }

        function unlock() {
            canMove =
                document.pointerLockElement === document.body ? true : false;
        }

        document.addEventListener("pointerlockchange", () => unlock());
        window.addEventListener("mousemove", e => updatePosition(e));
        document.body.addEventListener("click", () =>
            document.body.requestPointerLock()
        );
        this.world.on("begin-contact", e => handleContact(e));

        this.renderer();
    }
}

export default new PlanckTest();
