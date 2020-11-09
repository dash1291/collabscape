Tone.Transport.bpm.value = 90;
var sampleCount = 13;

let sampleList = ['NS-Sounddesign-As', "NS-Sounddesign-Ds", "NS-Sounddesign-F", "NS-Sounddesign-Gs"]
// let grainer = new Tone.GrainPlayer({
//     url: 'sounds/dense-future/'+sampleList[0]+'.wav',
//     loop: true,
//     grainSize: 0.001,
//     overlap: 0.005,
//     playbackRate: 0.0125,
//     onload: () => {
//         grainer.start();
//     }
// }).connect(masterlpf);
// grainer.volume.value = -15;

var marimba = audio.createInstrument('sounds/marimba', [-12, -5, 0, 3, 5, 7, 8, 12]);
console.log(marimba)

var notes = audio.getNotesTunejs('slendro', [60, 64, 72]); // get frequencies for specified scale intervals
console.log(notes)
// loops.push(audio.startCurrentLoop([[0, "C4"], [0, "E4"], "G4", ["A4", "G4"]], '4:0:0'));
// loops.push(audio.startSequence(marimba, [['C4'], [0, "DS4"]], '1:0:0'))

// audio.loadNumberedFolder('scw', sampleCount);
// audio.loadNumberedFolder('hits', sampleCount);
// var notesS = audio.getNotesTunejs('slendro', [60, 63, 67])
// var notesJI = audio.getNotesTunejs('ji_12', [60, 63, 67])