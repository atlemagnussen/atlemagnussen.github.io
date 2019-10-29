class Mouse {
    constructor() {
        this._state = {
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
        this._state.x = e.clientX  - offset.left;
        this._state.y = e.clientY - offset.top;
        if (this._state.down) {
            this._state.dragging = true;
        }
    }
    mousedownhandler(e) {
        this._state.down = true;
        this._state.downX = this._state.x;
        this._state.downY = this._state.y;
        e.preventDefault();
    }
    mouseuphandler() {
        this._state.down = false;
        this._state.dragging = false;
    }
    get state() {
        return this._state;
    }
}

export default new Mouse();