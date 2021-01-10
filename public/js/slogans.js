var socket = io();
let slogans = {
    s1: "",
    s2: "",
    s3: "",
    s4: "",
    s5: ""
};

let s1;
let s2;
let s3;
let s4;
let s5;

function GetTextValues() {
    s1 = document.getElementById("s1").value;
    s2 = document.getElementById("s2").value;
    s3 = document.getElementById("s3").value;
    s4 = document.getElementById("s4").value;
    s5 = document.getElementById("s5").value;
}

socket.emit('new player');

function SubmitSlogans() {  
    GetTextValues();
    slogans.s1 = s1;
    slogans.s2 = s2;
    slogans.s3 = s3;
    slogans.s4 = s4;
    slogans.s5 = s5;
    GoToResultsPage();
}

function SendDataToServer() {
    socket.emit('slogans', slogans);
}

const GoToResultsPage = async () => {
    const result = await SendDataToServer();
    // window.location.href = "http://localhost:5000/results";
};


