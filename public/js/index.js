let createGame = document.getElementById("createGame");
let firstPage = document.getElementById("firstPage");
let secondPage = document.getElementById("secondPage");

function firstShow() {
    firstPage.style.display = "block";
    secondPage.style.display = "none";
}

function secondShow() {
    firstPage.style.display = "none";
    secondPage.style.display = "block";
}


