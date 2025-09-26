const doc = document;

const Body = doc.querySelector("body");
const WP = doc.querySelector("div");
const DT = doc.getElementById("data");
const Slodder = doc.getElementById("slider");

let WPRect = WP.getBoundingClientRect()
const Offset = [WPRect.left, WPRect.top]
const Size = [WPRect.right - Offset[0], WPRect.bottom - Offset[1]]
const OX = Offset[0], OY = Offset[1], SX = Size[0], SY = Size[1];


// Parameters for physics
let Timestep = 1 / 120
let Gravity = -9.81;
let Scale = 1 / .5;

// Objects
let Player = null;
let PS = [150, 150]; // size
let Velo = [(.5 - Math.random()) * 4000, (.5 - Math.random()) * 2000]; // tilfeldig velocity
let Position = [550, 50];
let Bounciness = 0.9;

// Other
let ButtonState = false;
let Interval = null;


// Initiate objects
function Init() {
    // Player
    Player = doc.createElement("div");
    Player.style = "background-color: rgb(20, 40, 80); width: " + PS[0] + "px; height: " + PS[1] + "px; position: absolute; border-radius: 100%;"
    SetPos(Player, Position[0], Position[1])
    
    WP.appendChild(Player);
}

let i = 0;

// Main loop
function Loop() {

    Gravity = Slodder.value;

    // PHYSICS
    Velo[1] -= Gravity * Scale;

    Position[0] += Velo[0] * Timestep;
    Position[1] += Velo[1] * Timestep;

    // COLLISION
    if (Position[1] + PS[1] >= SY + OY) {
        Velo[1] = -Velo[1] * Bounciness;
        Velo[0] *= Bounciness;

        Position[1] = SY + OY - PS[1];
        //a()
    } else if (Position[1] <= OY) {
        Velo[1] = -Velo[1] * Bounciness;
        Velo[0] *= Bounciness;

        Position[1] = OY;
        //a()
    }

    if (Position[0] + PS[0] >= SX + OX) {
        Velo[0] = -Velo[0] * Bounciness;
        Velo[1] *= Bounciness;

        Position[0] = SX + OX - PS[0];
        //a()
    } else if (Position[0] <= OX) {
        Velo[0] = -Velo[0] * Bounciness;
        Velo[1] *= Bounciness;

        Position[0] = OX;
        //a()
    }

    SetPos(Player, Position[0], Position[1]);

    DT.innerHTML = 
        "Position: " + Math.floor(Position[0] + .5) + ", " + Math.floor(Position[1] + .5);

}

// Start
function Start() {
    Init();
    Interval = setInterval(Loop, Timestep * 1000);
    Breakbtn.value = "Pause";
}

function buttonFnc() {
    ButtonState = !ButtonState;
    
    if (ButtonState) {
        clearInterval(Interval); // Stop running
        Breakbtn.value = "Start";
    } else {
        Interval = setInterval(Loop, Timestep * 1000); // Restart the game
        Breakbtn.value = "Pause";
    }
}


function a() {
    PS = [PS[0] + 5, PS[1] + 5]
    Player.style = "width: " + PS[0] + "px; height: " + PS[1] + "px; position: absolute;";
}



// BUTTONS
const Breakbtn = document.getElementById("Break");
Breakbtn.addEventListener("click", buttonFnc);

const Stepbtn = document.getElementById("Step");
Stepbtn.addEventListener("click", Loop);


Start();

// oskar var her
// sander var her også



// INPUT
doc.onkeydown = function(e) {
    if (e.key == "d") {
        Velo[0] += 500
    } else if (e.key == "a") {
        Velo[0] -= 500
    }
};

// UTIL
function SetPos(element, x, y) {
    element.style.left = (x).toString() + "px";
    element.style.top = (y).toString() + "px";
}