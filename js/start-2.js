const init = () => {

    const canvas = document.getElementById("app-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.backgroundColor = "black";
    canvas.style.zIndex = 1;

    const ctx = canvas.getContext("2d");

    function draw(ctx, x, y) {
        ctx.save();
        ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fillRect(x, 10, 10, 10);
        ctx.restore();
        x += 5;
        window.requestAnimationFrame(() => draw(ctx, x, y));
    }

    draw(ctx,0,0);
}

init();
