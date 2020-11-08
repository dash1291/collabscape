// this is like a handshake or init event
var socket = io.connect();
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
  currentInstrument = msg.userId % sampleCount;
  console.log("Got someone in: "+userId);
  console.log(usersPos.count + " people in the room");

  usersPos[userId] = msg.position;
  lastTransmittedPos = {
    x: msg.position.x,
    y: msg.position.y
  }

  Tone.Listener.positionX = msg.position.x;
  Tone.Listener.positionY = msg.position.y
  Tone.Listener.forwardZ = -1
  // instruments[userId % sampleCount].panner.setPosition(msg.position.x, msg.position.y, 0)
  
  // usersPos = msg.usersPos
  Object.keys(usersPos).forEach(i => {
    // instruments[i % sampleCount].panner.setPosition(usersPos[i].x, usersPos[i].y, 0)
  })
  
  usersPos[userId] = msg.position;
  usersPos[userId].playedAt = 0;
});

// this is emitted when another peer joins
socket.on('join', msg => {
  var thisUser = msg.userId
  console.log(thisUser + ": joined us");
  usersPos[thisUser] = msg.position;
  usersPos = msg.usersPos
  audio.instruments[thisUser % sampleCount].panner.setPosition(msg.position.x, msg.position.y, 0)
});


// this is emitted when another peer sends their melody
socket.on('line', msg => {
  console.log(msg.userId+": sent something")
  let note = msg.note;
  let duration = msg.duration;
  usersPos[msg.userId].playedAt = +new Date()
  audio.instruments[msg.userId % sampleCount].synth.triggerAttackRelease(note, duration)
}); 

// this is emitted when another peer moves
socket.on('move', msg => {
  console.log(msg.userId + ": moved to " + msg.position)
  var thisUser = msg.userId
  usersPos[thisUser] = msg.position;
  audio.instruments[thisUser % sampleCount].panner.setPosition(msg.position.x, msg.position.y, 0)
});

// this is emitted when another peer leaves \o
socket.on('leave', msg => {
  console.log(msg.userId + ": left")
  var thisUser = msg.userId
  delete usersPos[thisUser];
});

socket.onPositionChange = function(userXY) {
  socket.emit('move', {
    userId: userId,
    position: userXY
  })
}
