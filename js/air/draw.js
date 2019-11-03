class Draw {
    constructor(ctx) {
        this.ctx = ctx;
    }
    edge(o) {
        const ctx = this.ctx;
        const shape = o.fixture.getShape();
        //const r = shape.getRadius();
        ctx.strokeStyle = o.color;
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
        ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
        ctx.stroke();
    }
    circle(o) {
        const ctx = this.ctx;
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
        if (o.body.selected) {
            ctx.fillStyle = "darkcyan";
            ctx.strokeStyle = "cyan";
            ctx.fill();
        }
        ctx.stroke();
    }
    polygon(fix) {
        const ctx = this.ctx;
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
    text(o) {
        const ctx = this.ctx;
        if (o.visible) {
            ctx.font = "20px Georgia";
            ctx.fillText(o.text, o.pos.x, o.pos.y);
        }
    }
}

export default Draw;