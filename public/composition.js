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

    var marimba = audio.createInstrument(audio.roomInstrumentName, loadKeys);
    //var marimba = audio.getRoomInstrument(loadKeys)
    console.log(marimba)

    var notes = audio.getNotesTunejs('slendro', [60, 64, 72]); // get frequencies for specified scale intervals
    console.log(notes)
    // loops.push(audio.startCurrentLoop([[0, "C4"], [0, "E4"], "G4", ["A4", "G4"]], '4:0:0'));

    // loops.push(audio.startSequence(marimba, ['C4', "D#4"], 0))
    loops.push(audio.startSequence(marimba, [0, 'E4', 0], '4m'))
    loops.push(audio.startSequence(marimba, ['C5', 0, 'G4', 0, 'G#4'], 0))

    // loops.push(audio.startLoop(marimba, ['C3', 'E3', 'G3'], '2t', 0))
    // loops.push(audio.startLoop(marimba, ['G3'], '2n', '4t'))
    // loops.push(audio.startPart(marimba, [[0, 0], ['4t', 'E3'], ['', 0]], 0))


    // audio.loadNumberedFolder('scw', sampleCount);
    // audio.loadNumberedFolder('hits', sampleCount);
    // var notesS = audio.getNotesTunejs('slendro', [60, 63, 67])
    // var notesJI = audio.getNotesTunejs('ji_12', [60, 63, 67])
}