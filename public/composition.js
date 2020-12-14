Tone.Transport.bpm.value = 90;
var sampleCount = 13;

let sequences = ["0 3", "~ 5 ~", "12 ~ 7 ~ 8", "24 24 ~"];
let pattern = [0, 2, 4, 5, 7, 9, 11];
let tracks = [];
let trackCount = 20;

var composition = {}

composition.handleTrackStart = function(trackNumber) {
    tracks[trackNumber].start()
}

composition.handleTrackStop = function(trackNumber){
    tracks[trackNumber].stop()
}

composition.startComposition = function(instrumentName) {
    let loadKeys = [0, 3, 5, 7, 8];

    let tunerRand = function (num) {
        let tunes = ['ji_12', 'slendro', 'jorgensen', 'jousse', 'jousse2', 'balafon', 'bolivia', 'burma3', 'hammond', 'helmholtz', 'hirajoshi', 'hummel', 'rousseauw', 'tamil', 'turkish_bagl'];
        return tunes[Math.floor(Math.random() * tunes.length)];
    }
    
    for (let index = 0; index <= trackCount; index++) {
        tracks[index] = new Track(tunerRand());

        let instrument = audio.createInstrument(instrumentName, loadKeys);
        tracks[index].synth = instrument.synth;
        tracks[index].panner = instrument.panner;
        tracks[index].addSequence(sequences[modulo(index, 4)]);
        switch (index) {
            case 4:
                tracks[index].transpose = -12;
                break;
            case 5:
                tracks[index].transpose = 24;
                break;
            case 6:
                tracks[index].transpose = 12 + 7;
                break;
            case 7:
                tracks[index].transpose = 24 + 7;
                break;
            case 8:
                tracks[index].phase = 0.25;
                break;
            case 9:
                tracks[index].phase = 0.5;
                break;
            default:
                tracks[index].phase = 0.06125 * modulo(index, 4);
                break;
        }
    }
    
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