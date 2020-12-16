Tone.Transport.bpm.value = 90;
var sampleCount = 13;

let sequences = ["0 3", "~ 5 ~", "12 ~ 7 ~ 8", "24 24 ~"];
// let pattern = [0, 2, 4, 5, 7, 9, 11];
let pattern = [0, 3, 5, 7, 8, 12, 24];
let loadKeys = [0, 3, 5, 7, 8];
let tracks = [];
let trackCount = 20;

var composition = {}

composition.handleTrackStart = function(instrumentName) {
    let tunerRand = function (num) {
        let tunes = ['ji_12', 'slendro', 'jorgensen', 'jousse', 'jousse2', 'balafon', 'bolivia', 'burma3', 'hammond', 'helmholtz', 'hirajoshi', 'hummel', 'rousseauw', 'tamil', 'turkish_bagl'];
        return tunes[Math.floor(Math.random() * tunes.length)];
    }

    let track = new Track(tunerRand());
    let instrument = audio.createInstrument(instrumentName, loadKeys);
    track.synth = instrument.synth;
    track.panner = instrument.panner;
    track.addSequence(sequences[modulo(tracks.length - 1, 4)]);
    
    let index = tracks.length;

    switch (index) {
        case 4:
            track.transpose = -12;
            break;
        case 5:
            track.transpose = 24;
            break;
        case 6:
            track.transpose = 12 + 7;
            break;
        case 7:
            track.transpose = 24 + 7;
            break;
        case 8:
            track.phase = 0.25;
            break;
        case 9:
            track.phase = 0.5;
            break;
        default:
            track.phase = 0.06125 * modulo(index, 4);
            break;
    }

    tracks.push(track)
    track.start()
    
    return {
        track: track,
        trackNumber: tracks.length - 1
    }
}

composition.handleTrackStop = function(trackNumber){
    tracks[trackNumber].stop()
    tracks.splice(trackNumber, 1)
}

composition.startComposition = function(instrumentName, numTracks) {
    randomInterval = setInterval('randomSounds();', rand);

    // tracks[1].loadScale(tunerRand());
    // tracks[1].addPattern(pattern);
    // tracks[1].addSequences(sequences);
    // tracks[1].addSequence(sequences[0]);
    // Phase can be changed with this but it does't get affected
    // till the next restart
    // tracks[1].phase = 0.25;
    
    // audio.loadNumberedFolder('scw', sampleCount);
    // audio.loadNumberedFolder('hits', sampleCount);
}

var randomInterval;
var rand = 300;

function randomSounds() {
    doSomethingInteresting();
    rand = Math.round(Math.random() * (30000 - 15000)) + 50000;
    clearInterval(randomInterval);
    randomInterval = setInterval('randomSounds();', rand);
}

randomInterval = setInterval('randomSounds();', rand);

const oscillators = [];

let bassFreq = 32;

const feedbackDelay = new Tone.FeedbackDelay("8n", 0.8).toDestination();
const padlpf = new Tone.Filter(3000, "lowpass").connect(feedbackDelay);

for (let i = 0; i < 4; i++) {
    oscillators.push(new Tone.Oscillator({
        frequency: bassFreq * i,
        type: "sawtooth4",
        volume: -Infinity,
        detune: Math.random() * 30 - 15,
    }).connect(padlpf));
    //.toDestination());
}

// bind the interface
startSound = () => {
    oscillators.forEach(o => {
        o.start();
        o.volume.rampTo(-40, "8m");
    });
};

stopSound = () => {
    oscillators.forEach(o => {
        o.stop("+1.2");
        o.volume.rampTo(-Infinity, 2);
    });
};

function doSomethingInteresting() {
    stopSound();
    if (tracks[0]) {
        // bassFreq = tracks[0].scale.note(48 + Math.round(Math.random() * 16))
        bassFreq = tracks[0].scale.note(36 + pattern[Math.round(Math.random() * (pattern.length - 1))])
    }
    //document.getElementById("notif").textContent = bassFreq;
    oscillators.forEach((osc, i) => {
        // osc.frequency.rampTo(bassFreq * i * Math.round(Math.random()), 0.4);
        osc.frequency.rampTo(bassFreq * i, "6m");
        // osc.frequency = bassFreq * i;
    });
    if (audio.isPlaying) startSound();
}