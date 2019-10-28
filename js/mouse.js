class Mouse {
    constructor() {
        this.config = {
            "x": 0,
            "y": 0,
            "down": false
        };
    }
    init() {
        this.canvas = document.getElementById("gamecanvas");
        this.canvas.addEventListener("mousemove", (e) => this.mousemovehandler(e));
        this.canvas.addEventListener("mousedown", (e) => this.mousedownhandler(e));
        this.canvas.addEventListener("mouseup", (e) => this.mouseuphandler(e));
        this.canvas.addEventListener("mouseout", (e) => this.mouseuphandler(e));
    }
    mousemovehandler(e) {
        const offset = {
            left: this.canvas.offsetLeft,
            top: this.canvas.offsetTop
        };
        this.config.x = e.clientX  - offset.left;
        this.config.y = e.clientY - offset.top;
        if (this.config.down) {
            this.config.dragging = true;
        }
    }
    mousedownhandler(e) {
        this.config.down = true;
        this.config.downX = this.config.x;
        this.config.downY = this.config.y;
        e.preventDefault();
    }
    mouseuphandler() {
        this.config.down = false;
        this.config.dragging = false;
    }
}

export default new Mouse();