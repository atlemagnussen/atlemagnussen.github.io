const { Vec2, World, Edge, Circle, Box } = planck;

class PlanckTest {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.objects = [];
        if (!this.canvas) {
            throw new Error("missing canvas");
        }
    }
    setupShapes() {
        this.colors = [
            "red",
            "green",
            "blue",
            "purple",
            "yellow",
            "cyan",
            "chocolate",
            "crimson",
            "indigo",
        ];
        this.colorcount = 0;
        this.circle = new Path2D();
        this.circle.arc(0, 0, 10, 0, 2 * Math.PI);
    }
    getNextColor() {
        if (this.colorcount === this.colors.length) {
            this.colorcount = 0;
        } else {
            this.colorcount += 1;
        }
        return this.colors[this.colorcount];
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
    createNewObjectEveryNowAndThen() {
        let body = this.world.createBody().setDynamic();
        const fixture = body.createFixture(Circle(10, 10), {
            friction: 0,
            restitution: 0.8,
            density: 1.0,
        });
        body.setPosition(Vec2(Math.random() * 11, -200));
        //box.setMassData({
        //mass: 1,
        //center: Vec2(),
        // I: 1,
        //});
        this.objects.push({
            type: "circle",
            color: this.getNextColor(),
            fixture,
            body,
        });
        setTimeout(() => this.createNewObjectEveryNowAndThen(), 100);
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
        // for (var body = world.getBodyList(); body; body = body.getNext()) {
        //     for (
        //         var fixture = body.getFixtureList();
        //         fixture;
        //         fixture = fixture.getNext()
        //     ) {}
        world.step(dt, elapsed / 1000);
        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i];
            switch (object.type) {
                case "edge":
                    this.drawEdge(object);
                    break;
                case "circle":
                    this.drawCircle(object, i);
                    break;
                case "polygon":
                    this.drawPolygon(object);
                    break;
                default:
                    console.log(object.type);
                    break;
            }
        }
        window.requestAnimationFrame(() => this.renderer());
    }
    drawEdge(o) {
        const ctx = this.ctx;
        const shape = o.fixture.getShape();
        const r = shape.getRadius();
        ctx.strokeStyle = o.color;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
        ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
        ctx.stroke();
    }
    drawCircle(o, i) {
        const ctx = this.ctx;
        const shape = o.fixture.getShape();
        // const isActive = o.body.isActive();
        // console.log(`isActive=${isActive}`);
        const r = shape.getRadius();
        // const c = shape.getCenter();
        const pos = o.body.getPosition();
        if (pos.y > this.canvas.height / 2) {
            this.world.destroyBody(o.body);
            this.objects.splice(i, 1);
        } else {
            ctx.beginPath();
            ctx.fillStyle = o.color;
            // this.circle.moveTo(pos.x, pos.y);
            const circle = new Path2D();
            circle.arc(pos.x, pos.y, r, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill(circle);
        }
        // ctx.beginPath();
        // ctx.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
        // ctx.fillStyle = "green";
        // ctx.fill();
        // ctx.lineWidth = 5;
        // ctx.strokeStyle = "#003300";
        // ctx.closePath();
        // ctx.stroke();
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

        this.world = pl.World(Vec2(0, 100));
        // this.createPackOfBoxes();
        this.setupShapes();
        this.createNewObjectEveryNowAndThen();
        const body = this.world.createBody();
        const fixture = body.createFixture(
            pl.Edge(Vec2(-200, 200), Vec2(200, 200))
        );
        this.objects.push({
            type: "edge",
            color: "black",
            fixture,
            body,
        });
        // bar.setAngle(-0.25);

        this.lastUpdate = Date.now();
        this.renderer();
    }
}

export default new PlanckTest();
