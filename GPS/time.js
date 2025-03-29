const data = document.querySelector("#data");

function start_watching() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(success, error);
    } else {
        data.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function success(position) {
    const loc = position.coords;
    const date = new Date();
    const time = date.toLocaleTimeString() || "Time unavailable";

    data.innerHTML += `[${time}]<br>LAT: ${loc.latitude}<br>LON: ${loc.longitude}<br><br>`;
}

function error() {
    alert("Sorry, no position available.");
}

start_watching();