import * as b2 from "./box2Wrapper.js";

class Box {
    constructor() {}
    init() {
        this.config = {
            gravity: new b2.b2Vec2(0, 9.8),
            allowSleep: true,
            scale: 30,
            timeStep: 1.0 / 60,
            veloityIterations: 8,
            positionIterations: 3,
        };
        this.world = new b2.b2World(
            this.config.gravity,
            this.config.allowSleep
        );
        this.createFloor();
        this.createRectangularBody();
        this.createCircularBody();
        this.setupDebugDraw();
        this.animate();
    }
    setupDebugDraw() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");

        const debugDraw = new b2.b2DebugDraw();
        debugDraw.SetSprite(this.context);
        debugDraw.SetDrawScale(this.config.scale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(
            b2.b2DebugDraw.e_shapeBit | b2.b2DebugDraw.e_jointBit
        );
        this.world.SetDebugDraw(debugDraw);
    }
    animate() {
        this.world.Step(
            this.config.timeStep,
            this.config.veloityIterations,
            this.config.positionIterations
        );
        this.world.ClearForces();
        this.world.DrawDebugData();
        setTimeout(() => {
            this.animate();
        }, 1);
    }
    createFloor() {
        const bodyDef = new b2.b2BodyDef();
        bodyDef.type = b2.b2Body.b2_staticBody;
        bodyDef.position.x = 640 / 2 / this.config.scale;
        bodyDef.position.y = 450 / this.config.scale;

        const fixtureDef = new b2.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.2;
        fixtureDef.shape = new b2.b2PolygonShape();
        fixtureDef.shape.SetAsBox(
            320 / this.config.scale,
            10 / this.config.scale
        );
        fixtureDef.filter = new b2.b2FilterData();
        const body = this.world.CreateBody(bodyDef);
        const fixture = body.CreateFixture(fixtureDef);
    }
    createRectangularBody() {
        const bodyDef = new b2.b2BodyDef();
        bodyDef.type = b2.b2Body.b2_dynamicbody;
        bodyDef.position.x = 40 / this.config.scale;
        bodyDef.position.y = 100 / this.config.scale;

        const fixtureDef = new b2.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.3;
        fixtureDef.shape = new b2.b2PolygonShape();
        fixtureDef.shape.SetAsBox(
            30 / this.config.scale,
            50 / this.config.scale
        );
        fixtureDef.filter = new b2.b2FilterData();
        const body = this.world.CreateBody(bodyDef);
        const fixture = body.CreateFixture(fixtureDef);
    }
    createCircularBody() {
        const bodyDef = new b2.b2BodyDef();
        bodyDef.type = b2.b2Body.b2_dynamicbody;
        // bodyDef.linearVelocity = new b2.b2Vec2(0, 9.8);
        bodyDef.position.x = 130 / this.config.scale;
        bodyDef.position.y = 100 / this.config.scale;

        const fixtureDef = new b2.b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.7;
        fixtureDef.shape = new b2.b2CircleShape(30 / this.config.scale);
        fixtureDef.filter = new b2.b2FilterData();

        const body = this.world.CreateBody(bodyDef);
        const fixture = body.CreateFixture(fixtureDef);
    }
}

export default new Box();
