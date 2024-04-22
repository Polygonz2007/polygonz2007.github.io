const doc = document;

var image_select = doc.getElementById("image_select");
var download = doc.getElementById("download");
let history_list = doc.getElementById("history_list");
let options = doc.getElementById("options");

var canvas = doc.getElementById("canvas");
var context = canvas.getContext('2d');
let w, h;

// 
//  image: imagedata
//  action: (action to get to this image, with settings)
//
let history = [];
let args = [];


// Open an image
image_select.addEventListener("change", function(e) {
    console.log("Opening...");

    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            w = img.width, h = img.height;
            canvas.width = w;
            canvas.height = h;
            
            context.drawImage(img, 0, 0);
            log(getData(), "Loaded image");
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
});

// Download an image
download.addEventListener("click", function() {
    console.log("Downloading...");

    // Download
    var link = document.createElement('a');
    link.download = "Edit.png";
    link.href = canvas.toDataURL()
    link.click();
  });



// 
// BUTONS
//

// Undo
doc.getElementById("undo").addEventListener("click", undo);

doc.getElementById("invert_btn").addEventListener("click", invert);
doc.getElementById("chromatic_abberation_btn").addEventListener("click", chromatic_abberation);
doc.getElementById("box_blur_btn").addEventListener("click", box_blur);
doc.getElementById("noise_btn").addEventListener("click", noise);
doc.getElementById("caption_btn").addEventListener("click", caption);


// util
function getPixelCol(x, y) {
    return context.getImageData(x, y, 1, 1);
}

function getData() {
    return context.getImageData(0, 0, w, h);
}

function setData(data) {
    context.putImageData(data, 0, 0);
    return 0;
}

function update_history_panel() {
    // Update the history panel
    history_list.innerHTML = "";
    for (let i = 0; i < history.length; ++i) {
        history_list.innerHTML += "<li>" + history[i].comment + "</li>";
    }
}

function log(imageData, comment) {
    history.push({
        image: imageData,
        comment: comment
    });

    // Update the history panel
    update_history_panel();
}

function undo() {
    if (history.length > 1) {
        history.pop();
        setData(history[history.length - 1].image);

        update_history_panel();
    }
}


function input(fields) {
    args = [];
    options.hidden = false;

    for (let i = 0; i < fields.length; i++) {

    }

    return 0;
}








  // EDITS
  function invert() {
    const imageData = getData();
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
    
    setData(imageData);
    log(imageData, "Invert");
  }

  function chromatic_abberation() {
    const imageData = getData();
    const data = imageData.data;

    const shift = 4;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i + shift]; // red
        data[i + 1] = data[i + 1]; // green
        data[i + 2] = data[i + 2]; // blue
    }
    
    setData(imageData);
    log(imageData, "Chromtaic abberation");
  }

  function box_blur() {
    console.log("blurring");
    const imageData = getData();
    const data = imageData.data;

    const xs = 4;
    const ys = w * 4;

    //  A B C
    //  D E F
    //  G H I

    for (let i = 0; i < data.length; i += 4) {
        // Red
        const aR = data[i - ys - xs];
        const bR = data[i - ys];
        const cR = data[i - ys + xs];
        const dR = data[i - xs];
        const eR = data[i];
        const fR = data[i + xs];
        const gR = data[i + ys - xs];
        const hR = data[i + ys];
        const iR = data[i + ys + xs];
        const r = (aR + bR + cR + dR + eR + fR + gR + hR + iR) / 9;

        // Green
        const aG = data[i - ys - xs + 1];
        const bG = data[i - ys + 1];
        const cG = data[i - ys + xs + 1];
        const dG = data[i - xs + 1];
        const eG = data[i + 1];
        const fG = data[i + xs + 1];
        const gG = data[i + ys - xs + 1];
        const hG = data[i + ys + 1];
        const iG = data[i + ys + xs + 1];
        const g = (aG + bG + cG + dG + eG + fG + gG + hG + iG) / 9;

          // Blue
        const aB = data[i - ys - xs + 2];
        const bB = data[i - ys + 2];
        const cB = data[i - ys + xs + 2];
        const dB = data[i - xs + 2];
        const eB = data[i + 2];
        const fB = data[i + xs + 2];
        const gB = data[i + ys - xs + 2];
        const hB = data[i + ys + 2];
        const iB = data[i + ys + xs + 2];
        const b = (aB + bB + cB + dB + eB + fB + gB + hB + iB) / 9;

        data[i] = r; // red
        data[i + 1] = g; // green
        data[i + 2] = b; // blue
    }
    
    setData(imageData);
    log(imageData, "Box blur");
  }

function noise() {
    const amount = 10;

    const imageData = getData();
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] + ((-0.5 + Math.random()) * amount); // red
        data[i + 1] = data[i + 1] + ((-0.5 + Math.random()) * amount * 2); // green
        data[i + 2] = data[i + 2] + ((-0.5 + Math.random()) * amount * 2); // blue
    }

    setData(imageData);
    log(imageData, "Noise (" + amount + "%)");
}

function caption() {
    // Get input from user
    input(["Caption text"]);

    const text = args[0] || "Sample text";
    const text_size = Math.floor(h * 0.17);
    const imageData = getData();

    h += text_size;
    canvas.height = h;
    context.height = h;

    // Clear
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, w, h);
    
    // Text
    context.font = (text_size * 0.5) + "px Consolas"; // comic sans!!!
	context.textBaseline = "center";
	context.textAlign = "center";
	context.fillStyle = "#000000";
    context.fillText(text, w / 2, text_size / 2);

    // Image
    context.putImageData(imageData, 0, text_size);

    const current = getData();

    log(current, "Added caption " + text);
    update();
    return 0;
}