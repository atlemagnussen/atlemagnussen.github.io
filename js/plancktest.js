const { Vec2, World, Edge, Circle, Box } = planck;

class PlanckTest {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.bodies = [];
        if (!this.canvas) {
            throw new Error("missing canvas");
        }
    }
    createPackOfBoxes() {
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                let box = this.world.createBody().setDynamic();
                box.createFixture(Box(5, 5));
                box.setPosition(Vec2(i * 1, -j * 1 + 200));
                box.setMassData({
                    mass: 1,
                    center: Vec2(),
                    I: 1,
                });
            }
        }
    }
    createNewBoxEveryNowAndThen() {
        let box = this.world.createBody().setDynamic();
        box.createFixture(Circle(5, 5), {
            friction: 0,
            restitution: 0.8,
            density: 1.0,
        });
        box.setPosition(Vec2(Math.random() * 11, Math.random() * 11));
        //box.setMassData({
        //mass: 1,
        //center: Vec2(),
        // I: 1,
        //});
        setTimeout(() => this.createNewBoxEveryNowAndThen(), 100);
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

        world.step(dt, elapsed / 1000);
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
                    case "polygon":
                        this.drawPolygon(fixture);
                        break;
                    default:
                        console.log(type);
                        break;
                }
            }
        }
        window.requestAnimationFrame(() => this.renderer());
    }
    drawEdge(fix) {
        const ctx = this.ctx;
        const shape = fix.getShape();
        const r = shape.getRadius();
        ctx.strokeStyle = "#0F0";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
        ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
        ctx.stroke();
    }
    drawCircle(fix) {
        const ctx = this.ctx;
        const shape = fix.getShape();
        const r = shape.getRadius();
        const c = shape.getCenter();
        const pos = fix.getBody().getPosition();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#003300";
        ctx.closePath();
        ctx.stroke();
    }
    drawPolygon(fix) {
        const ctx = this.ctx;
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
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        const pl = planck;
        const Vec2 = pl.Vec2;

        this.world = pl.World(Vec2(0, 10));
        // this.createPackOfBoxes();
        this.createNewBoxEveryNowAndThen();
        var bar = this.world.createBody();
        bar.createFixture(pl.Edge(Vec2(-200, 300), Vec2(200, 300)));
        // bar.setAngle(-0.25);
        this.lastUpdate = Date.now();
        this.renderer();
    }
}

export default new PlanckTest();
