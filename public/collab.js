// this is like a handshake or init event
var socket = io.connect();
var usersPos = {};

if (window.location.search.match('room=(.*)')) {
    var room = window.location.search.match('room=(.*)')[1];
    socket.emit('room', room);
}

socket.on('welcome', msg => {
  userId = msg.userId
  currentInstrument = msg.userId % 13

  usersPos[userId] = msg.position;
  lastTransmittedPos = {
    x: msg.position.x,
    y: msg.position.y
  }

  Tone.Listener.positionX = msg.position.x;
  Tone.Listener.positionY = msg.position.y
  Tone.Listener.forwardZ = -1
  instruments[userId % 13].panner.setPosition(msg.position.x, msg.position.y, 0)
  
  // usersPos = msg.usersPos
  Object.keys(usersPos).forEach(i => {
    instruments[i % 13].panner.setPosition(usersPos[i].x, usersPos[i].y, 0)
  })
  
  usersPos[userId] = msg.position;
  usersPos[userId].playedAt = 0;
});

// this is emitted when another peer joins
socket.on('join', msg => {
  let userId = msg.userId
  usersPos[userId] = msg.position;
  usersPos = msg.usersPos
  // instruments[userId % 13].lpf
  instruments[userId % 13].panner.setPosition(msg.position.x, msg.position.y, 0)
});


// this is emitted when another peer sends their melody
socket.on('line', msg => {
  let note = msg.note;
  let duration = msg.duration;
  usersPos[msg.userId].playedAt = +new Date()
  instruments[msg.userId % 13].synth.triggerAttackRelease(note, duration)
}); 

// this is emitted when another peer moves
socket.on('move', msg => {
  let userId = msg.userId
  usersPos[userId] = msg.position;
  instruments[userId % 13].panner.setPosition(msg.position.x, msg.position.y, 0)
});

// this is emitted when another peer leaves \o
socket.on('leave', msg => {
  let userId = msg.userId;
  delete usersPos[userId];
});
