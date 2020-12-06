// Setup basic express server
var express = require('express');
const { all } = require('./assets');
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

var rooms = [
  {
    id: 0,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    currentUsers: 0
  },
  {
    id: 1,
    name: 'Clicks',
    instrument: 'marimba',
    maxUsers: 10,
    currentUsers: 0
  },
  {
    id: 2,
    name: 'marimba',
    instrument: 'marimba',
    maxUsers: 10,
    currentUsers: 0
  }
];

function getAvailableRoom() {
  return rooms.filter(r => r.maxUsers > r.currentUsers)[Math.floor(Math.random() * rooms.length)]
}

function getRoom(roomId) {
  return rooms.find(r => r.id === roomId);
}

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

  let allotedRoom;

  if (!socket.room) {
    allotedRoom = getAvailableRoom()
    socket.room = allotedRoom.id
    socket.join(allotedRoom.name);
  }
    
  socket.on('room', function(room) {
    let roomId = Number(room) // just to be sure
    allotedRoom = getRoom(roomId);
    socket.room = roomId
    socket.join(roomId);
  })

  let pos = getRandomPosition();

  usersPos[socket.userId] = pos;
  socket.emit('welcome', {userId: socket.userId, position: pos, usersPos: usersPos, instrument: allotedRoom.instrument });
  socket.to(socket.room).emit('join', {userId: socket.userId, position: pos, usersPos: usersPos});
  
  socket.on('line', function(obj) {
    socket.to(socket.room).emit('line', obj);
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
