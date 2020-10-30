Tone.Transport.bpm.value = 90;

// Instruments definitions
for (var i = 13; i >= 0; i--) {
    let newInst = createSampler(i, 'sounds');
    // newInst.volume.value = -6;
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
        lpf,
        lpf
    });
}

var notes = getNotesTunejs('slendro', [60, 64, 72]); // get frequencies for specified scale intervals
// console.log(notes)
loops.push(startLoop(() => notes[0], '0:0:0', '2:0:0'));
loops.push(startLoop(() => notes[1], '4:2:0', '1:0:0'));
loops.push(startLoop(() => notes[2], '4:0:3', '0:1:0'));
