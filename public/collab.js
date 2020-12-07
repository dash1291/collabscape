// this is like a handshake or init event
var socket = assetPaths.length ? io.connect('https://collab-noisescape.glitch.me') : io.connect();
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
  userId = msg.userId;
  usersPos = msg.usersPos; // Gets positions of all users
  usersPos[userId] = socket.getRandomPosition();
  usersPos[userId].playedAt = 0;
  currentInstrument = msg.userId % audio.instruments.length;
  console.log("Got someone in: " + userId);
  console.log(usersPos.length + " people in the room");

  usersPos[userId] = msg.position;
  lastTransmittedPos = {
    x: msg.position.x,
    y: msg.position.y
  }

  audio.onRoomJoined(userId, msg.instrument, msg.position, usersPos)
  startComposition();
});

// this is emitted when another peer joins
socket.on('join', msg => {
  var thisUser = msg.userId
  console.log(thisUser + ": joined us");
  usersPos[thisUser] = msg.position;
  usersPos = msg.usersPos
  audio.instruments[audio.currentInstrument].panner.setPosition(msg.position.x, msg.position.y, 0)
});


// this is emitted when another peer sends their melody
socket.on('line', msg => {
  console.log(msg.userId + ": sent something")
  let note = msg.note;
  let duration = msg.duration;
  usersPos[msg.userId].playedAt = +new Date()
  // Don't try to play the current users notes
  // if (audio.isPlaying && msg.userId != userId) {
    audio.instruments[audio.currentInstrument].synth.triggerAttackRelease(note, duration)
  // }
});

// this is emitted when another peer moves
socket.on('move', msg => {
  console.log(msg.userId + ": moved to " + msg.position)
  var thisUser = msg.userId
  usersPos[thisUser] = msg.position;
  audio.instruments[audio.currentInstrument].panner.setPosition(msg.position.x, msg.position.y, 0)
});

// this is emitted when another peer leaves \o
socket.on('leave', msg => {
  console.log(msg.userId + ": left")
  var thisUser = msg.userId
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
