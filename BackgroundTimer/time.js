(async () => {
    let s = 0;
    let text = document.querySelector("#seconds");


    while (true) {
        await sleep(1000);
        s += 1;
        text.innerText = `${s} seconds`;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})()