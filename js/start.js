const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const canvas = document.getElementById("app-canvas");
canvas.width = windowWidth;
canvas.height = windowHeight;
canvas.style.position = "absolute";
canvas.style.backgroundColor = "#f6f6f6";
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
        this.squares.push(square);
    }

    renderSquares() {
        this.renderSquares();
        this.squares.forEach(square => {
            square.draw(this.context);
        });
    }

    renderOrbs() {
        this.orbs.forEach(orb => {
            this.orbs.map(connectToObject => {
                const color = orb.options.color;
                const r = orb.options.r;
                const orbX = orb.options.x;
                const orbY = orb.options.y;
                const connectToObjectX = connectToObject.options.x;
                const connectToObjectY = connectToObject.options.y;
                const distanceBetweenOrbs = Math.sqrt( (orbX-connectToObjectX) * (orbX-connectToObjectX) + (orbY-connectToObjectY) * (orbY-connectToObjectY) );
                if (distanceBetweenOrbs < 500) {
                    orb.connect(this.context, connectToObject);
                    this.squares.map(square => {
                        let squareX = square.options.x;
                        let squareY = square.options.y;
                        let squareWidth = square.options.width;
                        const distanceBetweenSquares = Math.sqrt( (orbX-squareX) * (orbX-squareX) + (orbY-squareY) * (orbY-squareY) );
                        if (distanceBetweenSquares < squareWidth) {
                            square.blink();
                        }
                    });
                }
            });
            orb.draw(this.context);
        });
    }

    render() {
        setInterval(() => {
            this.context.clearRect(0, 0, windowWidth, windowHeight);
            this.orbs.length > 1 && this.renderOrbs();
            this.squares.length > 1 && this.renderSquares();
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

    blink() {
        this.options.color = "rgba(255,255,255,.5)";
    }

    draw(ctx) {
        let x = this.options.x;
        let y = this.options.y;
        let width = this.options.width;
        let height = this.options.height;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.rect(x, y, width, height);
        ctx.fillStyle = this.options.color;
        ctx.fill();
    }
};

let squares = [];
let squareWidth = 50;
let squareHeight = 50;
let x = 0;
let y = 0;
const amountX = Math.floor((windowWidth + squareWidth) / squareWidth);
const amountY = Math.floor((windowHeight + squareHeight) / squareHeight);
const numberOfSquares = amountX * amountY;
for (let i = 0; i < numberOfSquares; i++) {
    if (x > windowWidth) {
        x = 0;
        y += squareHeight;
    }
    let square = new Square({ x, y, width: squareWidth, height: squareHeight, color: "rgba(255,255,255,.1)" });
    squares.push(square);
    x += squareWidth;
}

let orbs = [];
for (let i = 0; i < windowWidth / 100; i++) {
    let dx = Math.random() <= 0.5 ? -1 : 1;
    let dy = Math.random() <= 0.5 ? -1 : 1;
    let x = Math.floor(Math.random() * windowWidth) + 1;
    let y = Math.floor(Math.random() * windowHeight) + 1;
    let radius = Math.floor(Math.random() * 5) + 3;
    let color = "#222222";
    let orb = new Orb({ x, y, dx, dy, radius, color });
    orbs.push(orb);
}

let scene = new Scene();
//squares.forEach(square => scene.addSquare(square));
orbs.forEach(orb => scene.addOrb(orb));

scene.render();
