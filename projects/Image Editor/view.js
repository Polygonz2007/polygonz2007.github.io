
var body = doc.body;
var canvas = doc.getElementById("canvas");
var viewort = doc.getElementById("viewport");

let zoom = 1;
let x = 0, y = 0;
const screen_x = window.screen.height, screen_y = window.screen.width;

function update() {
    const sx = zoom * w;
    const sy = zoom * h;

    canvas.style.top = y - (sy * 0.5) + "px";
    canvas.style.left = x - (sx * 0.5) + "px";

    canvas.style.width = sx + "px";
    canvas.style.height = sy + "px";
}

// Move
body.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        x += e.movementX;
        y += e.movementY;
    }

    update();
})

// Zoom
window.addEventListener("wheel", (e) => {
    const hover = doc.elementFromPoint(e.x, e.y);
    if (!(hover === viewport || hover === canvas))
        return;

    if (e.deltaY < 0)
        zoom *= 1.1;
    else
        zoom *= 0.9;

    update();
});


// Mouse down
var mouseDown = false;
body.onmousedown = (e) => { 
    // Only start dragging if we are over the canvas, stop afetr we leave
    const hover = doc.elementFromPoint(e.x, e.y);
    if (hover === viewport || hover === canvas);
        mouseDown = true;
}

body.onmouseup = (e) => {
  mouseDown = false;
}