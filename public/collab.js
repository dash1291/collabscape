// this is like a handshake or init event

var socket = assetPaths.length ? io.connect('68.183.90.165:3000') : io.connect('68.183.90.165:3000');

//var socket = io.connect('https://collab-noisescape.glitch.me');

var userId;
var usersPos = {};

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
  startComposition(msg.room.currentUsers);

  userId = msg.userId;

  usersPos = msg.room.users
  console.log('userspos ', usersPos)
  usersPos[userId].playedAt = 0;
  currentInstrument = msg.userId % audio.instruments.length;
  console.log("Got someone in: " + userId);
  console.log(Object.keys(usersPos).length + " people in the room");

  usersPos[userId] = msg.position;
  lastTransmittedPos = {
    x: msg.position.x,
    y: msg.position.y
  }

  console.log(msg.room);
  audio.onRoomJoined(userId, msg.room.instrument, msg.position, usersPos)
});


function getTrackForUser(userId) {
  return Object.keys(usersPos).findIndex(u => u === userId);
}

// this is emitted when another peer joins
socket.on('join', msg => {
  var thisUser = msg.userId
  console.log(thisUser + ": joined us");
  usersPos[thisUser] = msg.position;
  usersPos = msg.room.users

  audio.userInstruments[thisUser] = tracks[getTrackForUser(thisUser)]
  tracks[getTrackForUser(thisUser)].start()
  audio.userInstruments[thisUser].panner.setPosition(msg.position.x, msg.position.y, 0)
});

// this is emitted when another peer sends their melody
socket.on('line', msg => {
  let note = msg.note;
  let duration = msg.duration;
  usersPos[msg.userId].playedAt = +new Date()

  audio.userInstruments[msg.userId].synth.triggerAttackRelease(note, duration)
});

// this is emitted when another peer moves
socket.on('move', msg => {
  console.log(msg.userId + ": moved to " + msg.position)
  console.log(msg.position)
  var thisUser = msg.userId
  usersPos[thisUser] = msg.position;
  audio.userInstruments[thisUser].panner.setPosition(msg.position.x, msg.position.y, 0)
});

// this is emitted when another peer leaves \o
socket.on('leave', msg => {
  console.log(msg.userId + ": left")
  var thisUser = msg.userId
  delete audio.userInstruments[thisUser];
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
