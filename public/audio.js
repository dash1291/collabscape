var isPlaying = false;

Tone.Transport.bpm.value = 90;

var userId; // global identifier for the current user

var currentInstrument = 0;
var tune = new Tune();

function createSampler2(interpolation) {
  let urls = {}; 
  urls[60] = `sounds/${interpolation}.wav`; // load the sample for midiNote=60

  return new Tone.Sampler(urls);
}

var instruments = [];

// add some effects
let reverb = new Tone.Reverb({ decay: 2, wet: 0.3 });
reverb.generate();
reverb.connect(Tone.context.destination);
let masterlpf = new Tone.Filter(8000, "lowpass").connect(reverb);

for (var i = 13; i >= 0; i--) {
  let newInst = createSampler2(i);
  let lpf = new Tone.Filter(600, "lowpass").connect(masterlpf);
  let panner = new Tone.Panner3D({
    panningModel: "HRTF",
    positionX: 0,
    positionY: 0,
    refDistance: 0.1
  })

  panner.connect(lpf);
  newInst.connect(panner)
  instruments.push({
    synth: newInst,
    duration: '0:2',
    panner: panner,
    lpf, lpf
  });
}

function startLoop(getNote, delay, interval) {
  return new Tone.Loop(function(time) {
    usersPos[userId].playedAt = +new Date();
    instruments[currentInstrument].synth.triggerAttackRelease(getNote(), '1:0:0');
    socket.emit('line', {synth: 1, note: getNote(), duration: '1:0:0', userId: userId});
  }, interval).start(delay);
}

function getNotes(root, intervals) {
  let randomIntervals = intervals.sort(function() {
    return .5 - Math.random();
  });
  
  return Tone.Frequency(root).harmonize(randomIntervals).map(function (f) { return f.toNote() })
}

function getNotesTunejs(scale, intervals) {
  tune.loadScale(scale);
  //tune.tonicize(rootFreq);
  return tune.chord(intervals);
}

var notes = getNotesTunejs('slendro', [60, 64, 72]); // get frequencies for specified scale intervals
console.log(notes)
let loops = []
loops.push(startLoop(() => notes[0], '0:0:0', '2:0:0'));
loops.push(startLoop(() => notes[1], '4:2:0', '1:0:0'));
loops.push(startLoop(() => notes[2], '4:0:3', '0:1:0'));
// loops.push(startLoop(() => notes[3], '4:0:3', '0:1:2'));

Tone.Transport.start('+0.1')

document.onclick = function() {
  Tone.context.resume()
}

// this is like a handshake or init event
var usersPos = {};

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
  
  usersPos = msg.usersPos
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
