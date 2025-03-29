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

    data.innerHTML += `[${Date.now().toLocaleTimeString()}]<br>LAT: ${loc.latitude}<br>LON: ${loc.longitude}`;
}

function error() {
    alert("Sorry, no position available.");
}

start_watching();