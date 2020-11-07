// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));
var assets = require('./assets');
app.use("/assets", assets);


// Chatroom

var numUsers = 0;

var rooms = {};

function getRandomPosition() {
  return {
    x: Math.random(),
    y: Math.random()
  }
}

let usersPos = {}

io.on('connection', function (socket) {
  socket.userId = numUsers
  numUsers++;
  
  socket.on('room', function(room) {
    socket.room = room
    socket.join(room);
    let pos = getRandomPosition();

    usersPos[socket.userId] = pos;
    socket.emit('welcome', {userId: socket.userId, position: pos, usersPos: usersPos});
    socket.to(socket.room).emit('join', {userId: socket.userId, position: pos, usersPos: usersPos});
  });
  
  socket.on('line', function(obj) {
    socket.to(socket.room).emit('line', obj);
    //socket.to.emit('line', obj);
  });
  
  socket.on('disconnecting', () => {
    delete usersPos[socket.userId]
    socket.to(socket.room).emit('leave', {userId: socket.userId})
  });

  socket.on('move', function(obj) {
    socket.to(socket.room).emit('move',obj)
    usersPos[obj.userId]= obj.position
  });
});
