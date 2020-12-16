// this is like a handshake or init event

// var socket = assetPaths.length ? io.connect('68.183.90.165:3000') : io.connect('68.183.90.165:3000');

var socket = io.connect('https://do.ashishdubey.xyz');

var userId;
var usersPos = {};
var currentRoom = null;
var artificialNodes = 0;

// assign room if none is assigned
function assignRoom() {
  const url = new URL(document.location);
  const room = Math.floor((Math.random() * 100) + 1);
  url.searchParams.set('room', room);
  history.replaceState(null, room, url);
}

function readURL() {
  const url = new URL(document.location);

  if (url.searchParams.has('room')) {
    const room = url.searchParams.get('room');
    console.log("Joining room:" + room);
    socket.emit('room', room);
  } else {
    assignRoom()
  }
}

readURL();

socket.on('welcome', msg => {
  userId = msg.userId;
  usersPos = msg.room.users
  usersPos[userId].playedAt = 0;
  currentInstrument = msg.userId % audio.instruments.length;
  console.log("Got someone in: " + userId);
  console.log(Object.keys(usersPos).length + " people in the room");
  currentRoom = msg.room;
  usersPos[userId] = msg.position;
  lastTransmittedPos = {
    x: msg.position.x,
    y: msg.position.y
  }

  composition.startComposition(msg.room.instrument);
  audio.onRoomJoined(userId, msg.room.instrument, msg.position, usersPos)
});


function getTrackForUser(userId) {
  return Object.keys(usersPos).findIndex(u => u === String(userId));
}

// this is emitted when another peer joins
socket.on('join', msg => {
  var thisUser = msg.userId
  console.log(thisUser + ": joined us");
  usersPos[thisUser] = msg.position;
  usersPos = msg.room.users

  audio.onRoomJoined(thisUser, msg.room.instrument, msg.position, null)
});

// this is emitted when another peer sends their melody
socket.on('line', msg => {
  let note = msg.note;
  let duration = msg.duration;
  usersPos[msg.userId].playedAt = +new Date()

  audio.userInstruments[msg.userId].track.synth.triggerAttackRelease(note, duration)
});

// this is emitted when another peer moves
socket.on('move', msg => {
  console.log(msg.userId + ": moved to " + msg.position)
  console.log(msg.position)
  var thisUser = msg.userId
  usersPos[thisUser] = msg.position;
  audio.userInstruments[thisUser].track.panner.setPosition(msg.position.x, msg.position.y, 0)
});

// this is emitted when another peer leaves \o
socket.on('leave', msg => {
  console.log(msg.userId + ": left")
  var thisUser = msg.userId
  audio.onUserLeftRoom(thisUser);
  delete usersPos[thisUser];
});

socket.onPositionChanged = function(userXY) {
  socket.emit('move', {
    userId: userId,
    position: userXY
  })
}

socket.getRandomPosition = function() {
  return {
    x: Math.random(),
    y: 0
  }
}

function filterRealUsers(users) {
  let filteredUsers = {};
  Object.keys(users).forEach(k => {
    if (!users[k].isArtifical) {
      filterRealUsers[k] = users[k]
    }
  })

  return filterRealUsers;
}

function getRandomPosition() {
  return {
    x: Math.random(),
    y: Math.random()
  }
}

function makeNoiseIfTooQuite() {
  if (Object.keys(usersPos).length / currentRoom.maxUsers < 0.5) {
    let randomXY = getRandomPosition()
    let newUid = 100000000 + artificialNodes
    usersPos[newUid] = randomXY
    usersPos[newUid].isArtifical = true
    artificialNodes++    
    audio.onRoomJoined(newUid, currentRoom.instrument, randomXY, null)
    
    setTimeout(function() {
      audio.onUserLeftRoom(newUid)
      artificialNodes--
      delete usersPos[newUid]
    }, 180000 - 10000 * artificialNodes)

  }
  setTimeout(makeNoiseIfTooQuite, 10000 * (artificialNodes+1))
}

setTimeout(makeNoiseIfTooQuite, 10000);
