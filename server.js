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

server.listen(5000, () => {
  console.log('Starting server on port 5000');
});

var players = {};

let combinedslogans = [];

io.on('connection', (socket) => {
  socket.on('new player', () => {
    players[socket.id] = {
      s1: "",
      s2: "",
      s3: "",
      s4: "",
      s5: ""
    };
  });
  socket.on('slogans', (data) => {
      var player = players[socket.id] || {};
      combinedslogans.push(data.s1);
      combinedslogans.push(data.s2);
      combinedslogans.push(data.s3);
      combinedslogans.push(data.s4);
      combinedslogans.push(data.s5);

      PrintChoices();

  });
});

function PrintChoices() {
    io.sockets.emit('choices', combinedslogans);
}


