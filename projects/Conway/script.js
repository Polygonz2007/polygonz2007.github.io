const doc = document;
const master = document.querySelector("div");
const inspector = document.querySelector("header");

const INFO = document.querySelector("#info");
INFO.innerHTML = "Running";
INFO.style.color = "#0FF00F";

// ELEMENTS AND INPUTS
const FPS = doc.querySelector("#fps");
const BORDER = doc.querySelector("#border");
const BORDER_COL = doc.querySelector("#border_col");

const ALIVE_COL = doc.querySelector("#alive_col");
const DEAD_COL = doc.querySelector("#dead_col");


// SCREEN
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// SETTINGS
let Scale = Math.floor(vw / 80); // number = blocks over width of screen
let UpdateRate = FPS.value;
let CSmoothing = .1; // How much to smooth clock display value, lower = smoother

let Border = BORDER.value, BorderCol = BORDER_COL.value;
let AliveCol = ALIVE_COL.value, DeadCol = DEAD_COL.value;

// CALCULATED
let Clock = 1000 / UpdateRate;
let LastC = performance.now();
let SmoothTime = 0;


var Divs = [[]];
var Vals = [[]]; // multi dimensjonal eris

function Init() {
    for (let x = 0; x < Math.ceil(vw / Scale); x++) {
        let lastX = Math.floor(vw / Scale);
        Vals[x] = [];
        Divs[x] = [];

        for (let y = 0; y < Math.ceil(vh / Scale); y++) {
            let lastY = Math.floor(vh / Scale);
            let div = doc.createElement("div");

            // Style
            div.className = "pixel";
            div.style = `width: ${x == lastX ? vw - x * Scale : Scale}px; height: ${y == lastY ? vh - y * Scale : Scale}px;`;
            div.style.border = `${Border}px solid ${BorderCol}`;
            div.style.left = (x * Scale) + "px";
            div.style.top = (y * Scale) + "px";

            Vals[x][y] = Math.random() < .8 ? 0 : 1;
            let Color = Vals[x][y] == 0 ? DeadCol : AliveCol;
            div.style.backgroundColor = Color;

            master.appendChild(div);
            Divs[x][y] = div;
        }
    }
}


// Update stuff
function Update() {
    const XL = Divs.length, YL = Divs[0].length;

    // Update
    let Bor = false;
    if (BORDER.value != Border) { Border = BORDER.value; Bor = true; }
    if (BORDER_COL.value != BorderCol) { BorderCol = BORDER_COL.value; Bor = true; }
    if (ALIVE_COL.value != AliveCol) { AliveCol = ALIVE_COL.value; }
    if (DEAD_COL.value != DeadCol) { DeadCol = DEAD_COL.value; }

    // Draw
    for (let x = 0; x < XL; x++) {
        for (let y = 0; y < YL; y++) {
            let div = Divs[x][y];
            
            let Color = Vals[x][y] == 0 ? DeadCol : ("rgba(" + (x / XL) * 255 + ", " + (y / YL) * 255 + ", " + 255 + ", 1.0)");
            div.style.backgroundColor = Color

            if (Bor) {
                div.style.border = `${Border}px solid ${BorderCol}`;
            }
        }
    }

    // INFO
    if (Running) {
        let Now = performance.now();
        let Time = Now - LastC;
        SmoothTime = Math.floor(Time * CSmoothing + SmoothTime * (1 - CSmoothing));
        LastC = Now;

        INFO.innerHTML = "Running" + ` [${SmoothTime}ms, ${Math.floor(1000 / SmoothTime)}fps]`;
        INFO.style.color = "#0FF00F";
    } else {
        INFO.innerHTML = "Paused";
        INFO.style.color = "#F00F0F";

        let Now = performance.now();
        LastC = Now;
    }
}


// Iterate the simulation (and save?)
function Iterate() {
    let OldVals = Vals.slice();

    const XL = Vals.length;
    const YL = Vals[0].length;

    for (let x = 0; x < XL; x++) {
        Vals[x] = [];

        for (let y = 0; y < YL; y++) {
            let Tot = 0;

            let X0 = x > 0, X1 = x < XL - 1, Y0 = y > 0, Y1 = y < YL - 1;

            // Straight
            if (X0) { if (OldVals[x - 1][y] == 1) Tot++; }
            if (X1) { if (OldVals[x + 1][y] == 1) Tot++; }
            if (Y0) { if (OldVals[x][y - 1] == 1) Tot++; }
            if (Y1) { if (OldVals[x][y + 1] == 1) Tot++; }

            if (OldVals[x][y] == 1 && Tot >= 4) { Vals[x][y] = 0; continue; }

            // Diagonal
            if (X0 && Y0) { if (OldVals[x - 1][y - 1] == 1) Tot++; }
            if (X1 && Y0) { if (OldVals[x + 1][y - 1] == 1) Tot++; }
            if (X0 && Y1) { if (OldVals[x - 1][y + 1] == 1) Tot++; }
            if (X1 && Y1) { if (OldVals[x + 1][y + 1] == 1) Tot++; }

            // Change value
            if (OldVals[x][y] == 1) {
                if (Tot <= 1) { Vals[x][y] = 0; continue; }
                else if (Tot >= 4) { Vals[x][y] = 0; continue; }
                else { Vals[x][y] = 1; }
            } else {
                if (Tot == 3) { Vals[x][y] = 1; } else { Vals[x][y] = 0; }
            }

        }
    }
}

Init();

let Running = true;
let R = setInterval(Loop, Clock);

function Loop() {
    Iterate();
    Update();
}




// INPUT

doc.addEventListener("keypress", function(e) {
    e = e || window.event;
    console.log(e);

    if (e.key == " ") {
        Running = !Running;
        if (Running) { R = setInterval(Loop, Clock); } else { clearInterval(R); Update(); }
    } else if (e.key == "h") {
        inspector.hidden = !inspector.hidden;
    } else if (e.key == "c") {
        const XL = Vals.length;
        const YL = Vals[0].length;

        for (let X = 0; X < XL; X++) {
            for (let Y = 0; Y < YL; Y++) {
                Vals[X][Y] = 0;
            }
        }

        Update();
    } else if (e.key == "r") {
        const XL = Vals.length;
        const YL = Vals[0].length;

        for (let X = 0; X < XL; X++) {
            for (let Y = 0; Y < YL; Y++) {
                Vals[X][Y] = Math.random() < .5;
            }
        }

        Update();
    } else if (e.key == ".") {
        Loop();
    } else if (e.key == ",") {
        Vals = OldVals;
    }
})

doc.addEventListener("mousedown", function (e) {
    let X = e.clientX, Y = e.clientY;
    X = Math.floor(X / Scale), Y = Math.floor(Y / Scale);

    Vals[X][Y] = !Vals[X][Y];
    Update();
})
