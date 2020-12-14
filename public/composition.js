Tone.Transport.bpm.value = 90;
var sampleCount = 13;

let sequences = ["0 3", "~ 5 ~", "12 ~ 7 ~ 8", "24 24 ~"];
let pattern = [0, 2, 4, 5, 7, 9, 11];
let tracks = [];
let trackCount = 20;

var composition = {}

composition.handleTrackStart = function(instrumentName) {
    let loadKeys = [0, 3, 5, 7, 8];

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