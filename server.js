// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/public', express.static(__dirname + '/public'));

// Routing
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/slogans', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/slogans.html'));
});

app.get('/drawing', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/drawing.html'));
});

app.get('/results', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/results.html'));
});

server.listen(5000, () => {
  console.log('Starting server on port 5000');
});

var players = {};

let combinedslogans = [];
let alldrawings = [];

io.on('connection', (socket) => {
  socket.on('new player', () => {
    players[socket.id] = {
      s1: "",
      s2: "",
      s3: "",
      s4: "",
      s5: ""
    };
    //^ not really doing anything atm
  });

  socket.on('drawing', (data) => {
    alldrawings.push(data);
  })

  socket.on('slogans', (data) => {
      //var player = players[socket.id] || {};
      combinedslogans.push(data.s1);
      combinedslogans.push(data.s2);
      combinedslogans.push(data.s3);
      combinedslogans.push(data.s4);
      combinedslogans.push(data.s5);
      console.log("slogans event");
  });
  socket.on('data request', () => {
    SendImageDataBack();
    PrintChoices();
    console.log(combinedslogans);
  });
});

function PrintChoices() {
    io.sockets.emit('choices', combinedslogans);
}

function SendImageDataBack() {
    io.sockets.emit('images', alldrawings);
}


