Tone.Transport.bpm.value = 90;
var sampleCount = 13;

function startComposition() {
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
    var loadKeys = [0, 3, 5, 7, 8];

    var marimba = audio.userInstruments[userId]
    //var marimba = audio.getRoomInstrument(loadKeys)

    var noteList = [60, 63, 64, 66, 67, 72];

    // Test sequence
    // loops.push(audio.startSequence(marimba, ["C4", "G3"], 0))
    
    // Basic melody sequence with just intonation
    var notesJI = audio.getNotesTunejs('ji_12', noteList) // get frequencies for specified scale intervals
    loops.push(audio.startSequence(marimba, [notesJI[0], notesJI[1]], 0))
    loops.push(audio.startSequence(marimba, [0, notesJI[2], 0], 0))
    loops.push(audio.startSequence(marimba, [notesJI[5], 0, notesJI[3], 0, notesJI[4]], 0))
    
    // Basic melody sequence with just intonation shifted forward by 0.5 cycle
    // loops.push(audio.startSequence(marimba, [notesJI[0], notesJI[1]], 4.5))
    // loops.push(audio.startSequence(marimba, [0, notesJI[2], 0], 4.6))
    // loops.push(audio.startSequence(marimba, [notesJI[5], 0, notesJI[3], 0, notesJI[4]], 0.6))
    
    // Same composition in slendro
    // var notesS = audio.getNotesTunejs('slendro', noteList)
    // loops.push(audio.startSequence(marimba, [notesS[0], notesS[1]], 0))
    // loops.push(audio.startSequence(marimba, [0, notesS[2], 0], 0))
    // loops.push(audio.startSequence(marimba, [notesS[5], 0, notesS[3], 0, notesS[4]], 0))
    
    // audio.loadNumberedFolder('scw', sampleCount);
    // audio.loadNumberedFolder('hits', sampleCount);
}