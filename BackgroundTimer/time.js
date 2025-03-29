(async () => {
    let s = 0;
    let text = document.querySelector("#seconds");

    const x = document.getElementById("demo");

    function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(success, error);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    }

    function success(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
    }

    function error() {
    alert("Sorry, no position available.");
    }

    while (true) {
        await sleep(5000);
        getLocation();
    }
})()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}