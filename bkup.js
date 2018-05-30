const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const canvas = document.getElementById("app-canvas");
canvas.width = windowWidth;
canvas.height = windowHeight;
canvas.style.position = "absolute";
canvas.style.backgroundColor = "grey";
canvas.style.zIndex = 1;
document.body.appendChild(canvas);

class Scene {
    constructor() {
        this.orbs = [];
        this.squares = [];
        this.context = canvas.getContext("2d");
    }

    addOrb(orb) {
        this.orbs.push(orb);
    }

    addSquare(square) {
        this.orbs.push(square);
    }

    render() {
        setInterval(() => {
            this.context.clearRect(0, 0, windowWidth, windowHeight);
            this.orbs.forEach(object => {
                this.orbs.map(connectToObject => {
                    const color = object.options.color;
                    const r = object.options.r;
                    const x1 = object.options.x;
                    const y1 = object.options.y;
                    const x2 = connectToObject.options.x;
                    const y2 = connectToObject.options.y;
                    const distance = Math.sqrt( (x1-x2) * (x1-x2) + (y1-y2) * (y1-y2) );
                    if (distance < 500) {
                        object.connect(this.context, connectToObject);
                    }
                });
                object.draw(this.context);
            });
        }, 10);
    }
}

class Orb {
    constructor(options) {
        this.options = options;
    }

    connect(ctx, connectTo) {
        let x = this.options.x;
        let y = this.options.y;
        if (this.isXOutOfBounds(x)) return;
        if (this.isYOutOfBounds(y)) return;

        ctx.beginPath();
        ctx.moveTo(this.options.x, this.options.y);
        ctx.lineTo(connectTo.options.x, connectTo.options.y);
        ctx.lineWidth = 1;
        ctx.strokeStyle = connectTo.options.color;
        ctx.stroke();

        this.options.dy =- this.options.dy;
    }

    draw(ctx) {
        let x = this.options.x;
        let y = this.options.y;
        let r = this.options.radius;
        let dx = this.options.dx;
        let dy = this.options.dy;

        if (this.isXOutOfBounds(x)) this.options.dx =- dx;
        if (this.isYOutOfBounds(y)) this.options.dy =- dy;

        this.options.x += this.options.dx;
        this.options.y += this.options.dy;

        ctx.beginPath();
        ctx.arc(this.options.x, this.options.y, this.options.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.fillStyle = this.options.color
        ctx.fill();
    }

    isXOutOfBounds(x) {
        const r = this.options.radius;
        if ( x - r < 0 || x + r > windowWidth  ) return true;
    }

    isYOutOfBounds(y) {
        const r = this.options.radius;
        if ( y - r < 0 || y + r > windowHeight ) return true;
    }
}

class Square {
    constructor(options) {
        this.options = options;
    }

    draw(ctx) {
        let x = this.options.x;
        let y = this.options.y;
        let width = this.options.width;
        let height = this.options.height;
        ctx.moveTo(x + width, y);
        ctx.rect(x, y, width, height);
        ctx.fillStyle = "rgba(255,255,255,.1)";
        ctx.fill();
    }
};

let squares = [];
let y = 0;
for (var x = 0; x < windowWidth; x += 10) {
    if (x >= windowWidth) {
        x = 0;
        y += 10;
    };
    let square = new Square({x, y, width: 10, height: 10})
    squares.push(square);
    //if (y > windowHeight) x = windowWidth;
}


let orbs = [];
for (let i = 0; i < windowWidth / 100; i++) {
    let dx = Math.random() <= 0.5 ? -1 : 1;
    let dy = Math.random() <= 0.5 ? -1 : 1;
    let x = Math.floor(Math.random() * windowWidth) + 1;
    let y = Math.floor(Math.random() * windowHeight) + 1;
    let radius = Math.floor(Math.random() * 5) + 3;
    let color = "pink";
    let orb = new Orb({ x, y, dx, dy, radius, color });
    orbs.push(orb);
}

let scene = new Scene();
squares.forEach(square => scene.addOrb(square));
orbs.forEach(orb => scene.addOrb(orb));

scene.render();
