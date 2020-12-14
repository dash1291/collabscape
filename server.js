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

// Chatroom

var numUsers = 0;

var rooms = [{
    id: 0,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    users: {}
  },
  {
    id: 1,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    users: {}
  },
  {
    id: 2,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    users: {}
  },
  {
    id: 3,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    users: {}
  },
  /*{
    id: 4,
    name: 'Clicks',
    instrument: 'scw',
    maxUsers: 10,
    users: {}
  },*/
  {
    id: 5,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    users: {}
  },
  {
    id: 6,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    users: {}
  },
  {
    id: 7,
    name: 'Ambient',
    instrument: 'marimba',
    maxUsers: 10,
    users: {}
  },
];

function getAvailableRoom() {
  // Returns the most crowded room among the rooms with available slots.
  // If no room is available then return the room with least number of people
  var availableRooms = rooms.filter(r => r.maxUsers > Object.keys(r.users).length)
  
  if (availableRooms.length > 0) {
    return availableRooms.sort((a, b) => {
      if (Object.keys(a.users).length > Object.keys(b.users).length) {
        return -1;
      } else if (Object.keys(a.users).length < Object.keys(b.users).length) {
        return 1;
      } else {
        return 0
      }
    })[0]
  } else {
    return rooms.sort((a, b) => {
      if (Object.keys(a.users).length < Object.keys(b.users).length) {
        return -1;
      } else if (Object.keys(a.users).length > Object.keys(b.users).length) {
        return 1;
      } else {
        return 0
      }
    })[0]
  }
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
    socket.room = String(allotedRoom.id)
    console.log('room', socket.room)

    socket.join(socket.room);
  }

  let pos = getRandomPosition();
  allotedRoom.users[socket.userId] = pos
  
  socket.emit('welcome', {userId: socket.userId, position: pos, room: allotedRoom });

  socket.to(socket.room).emit('join', {userId: socket.userId, position: pos, room: allotedRoom });

  socket.on('line', function(obj) {
    socket.to(socket.room).emit('line', obj);
  });
  
  socket.on('disconnecting', () => {
    delete allotedRoom.users[socket.userId]
    socket.to(socket.room).emit('leave', {userId: socket.userId})
  });

  socket.on('move', function(obj) {
    socket.to(socket.room).emit('move',obj)
    allotedRoom.users[obj.userId] = obj.position
  });
});
