class PlanckTest {
    constructor() {
        this.canvas = document.getElementById("canvas");
        if (!this.canvas) {
            throw new Error("missing canvas");
        }
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
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, 2 * Math.PI, false);
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
        const firstVert = shape.getVertex(0);
        ctx.moveTo(firstVert.x, firstVert.y);

        for (let i = 1; i < numVerts; i++) {
            const vert = shape.getVertex(i);
            ctx.lineTo(vert.x, vert.y);
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

        this.world = pl.World(Vec2(0, -10));

        var bar = this.world.createBody();
        bar.createFixture(pl.Edge(Vec2(-20, 5), Vec2(20, 5)));
        bar.setAngle(0.2);

        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                let box = this.world.createBody().setDynamic();
                box.createFixture(pl.Box(0.5, 0.5));
                box.setPosition(Vec2(i * 1, -j * 1 + 20));
                box.setMassData({
                    mass: 100,
                    center: Vec2(),
                    I: 1,
                });
            }
        }

        this.renderer();
    }
}

export default new PlanckTest();
