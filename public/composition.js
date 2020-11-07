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

var notes = getNotesTunejs('slendro', [60, 64, 72]); // get frequencies for specified scale intervals
console.log(notes)
loops.push(startCurrentLoop(() => notes[0], '0:0:0', '2:0:0'));
loops.push(startCurrentLoop(() => notes[1], '4:2:0', '1:0:0'));
loops.push(startCurrentLoop(() => notes[2], '4:0:3', '0:1:0'));

loadNumberedFolder('scw', sampleCount);
// loadNumberedFolder('hits', sampleCount);
var notesS = getNotesTunejs('slendro', [60, 63, 67])
var notesJI = getNotesTunejs('ji_12', [60, 63, 67])

// startLoop(0, ()=>notesS[0], '0:0:0', '0:1:0')
// startLoop(0, ()=>notesS[1], '1:0:0', '0:0:3')

// var marimba = createInstrument([0, 3, 5, 7, 8, 12], 'sounds/marimba');
// console.log(marimba)

// usersPos[userId] = {
//     x: Math.random(),
//     y: Math.random()
// }
// usersPos[userId].playedAt = 0
// startSeq(marimba, ()=>notesS, 0)

// usersPos[1] = {
//     x: Math.random(),
//     y: Math.random()
// }
// usersPos[1].playedAt = 0
// // startSeq(1, ()=>notesS, '0:0:3')
// startSeqUser(marimba, ()=>notesS, '0:0:3', 1)

// for (let index = 2; index < sampleCount; index++) {
//     usersPos[index] = {
//         x: Math.random(),
//         y: Math.random()
//     }
//     usersPos[index].playedAt = 0
//     // startSeqUser(index, () => notesS, '0:' + (1 + index) + ':' + (sampleCount % index), index)

// }

// startLoop(2, () => notesJI[0], '0:1:0', '0:1:3');
// startLoop(2, () => notesJI[0], '0:1:0', '0:2:2');
