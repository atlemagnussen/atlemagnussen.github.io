class Draw {
    all(world) {
        for (var body = world.getBodyList(); body; body = body.getNext()) {
            for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                const type = fixture.getType();
                const object = {
                    type,
                    body,
                    fixture,
                    color: "white",
                };
                this.draw(this.offscreenCtx, object);
            }
        }
    }
    draw(ctx, o) {
        switch (o.type) {
            case "edge":
                this.edge(ctx, o);
                break;
            case "circle":
                this.circle(ctx, o);
                break;
            case "polygon":
                this.polygon(ctx, o);
                break;
            case "text":
                this.text(ctx, o);
                break;
            default:
                console.log(o.type);
                break;
        }
    }
    edge(ctx, o) {
        const shape = o.fixture.getShape();
        //const r = shape.getRadius();
        ctx.strokeStyle = o.color;
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(shape.m_vertex1.x, shape.m_vertex1.y);
        ctx.lineTo(shape.m_vertex2.x, shape.m_vertex2.y);
        ctx.stroke();
    }
    circle(ctx, o) {
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
    polygon(ctx, fix) {
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
    text(ctx, o) {
        if (o.visible) {
            ctx.font = "2px Georgia";
            ctx.fillStyle = o.color ? o.color : "red";
            ctx.fillText(o.text, o.pos.x, o.pos.y);
        }
    }
}

export default new Draw();
