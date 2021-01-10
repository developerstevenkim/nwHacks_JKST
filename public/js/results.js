let socket = io();

let images;
let slogans;

socket.emit('data request');

socket.on('images', (data) => {
    document.getElementById("images").remove();
    CreateImageDiv();
    for (let i = 0; i < data.length; i++) {
        let img = document.createElement("img");
        img.src = data[i];
        document.getElementById("images").appendChild(img);
    }
});

socket.on('choices', (data) => {
    document.getElementById("slogans").remove();
    CreateSloganDiv();
    for (let i = 0; i < data.length; i++) {
        let slogan = document.createElement("p");
        slogan.innerText = data[i];
        document.getElementById("slogans").appendChild(slogan);
    }
});

function CreateImageDiv() {
    let images = document.createElement("div");
    images.id = "images";
    document.body.appendChild(images);
}

function CreateSloganDiv() {
    let slogans = document.createElement("div");
    slogans.id = "slogans";
    document.body.appendChild(slogans);
}

