let audio = {}
audio.isPlaying = false

audio.createSampler = function(interpolation, folder) {
    return new Tone.Sampler({
        urls: {
            60: interpolation + '.wav'
        },
        baseUrl: '/' + folder + '/',
    });
}

audio.createInstrument = function (folderName, loadKeys) {
    let defnotes = ['c','cs','d','ds','e','f','fs','g','gs','a','as','b'];
    let urls = {};
    for (let index = 0; index < loadKeys.length; index++) {
        let midiNum = loadKeys[index] + 60;
        var keyNum = loadKeys[index];
        var octave = Math.floor((keyNum + 36) / 12);
        var note = defnotes[(keyNum + 36) % 12];
        urls[midiNum] = note + octave + '.wav';
    }
    // return urls;
    var sampler = new Tone.Sampler({
        urls: urls,
        baseUrl: '/sounds/' + folderName + '/',
    });
    let lpf = new Tone.Filter(20000, "lowpass").connect(masterlpf);
    let panner = new Tone.Panner3D({
        panningModel: "HRTF",
        positionX: 0,
        positionY: 0,
        refDistance: 0.1
    })

    panner.connect(lpf);
    sampler.connect(panner)
    return {
        synth: sampler,
        duration: '4:0',
        panner: panner,
        lpf,
        lpf
    };
}

audio.loadFolder = function (folderName, sampleList) {
    for (var i = sampleList.count; i > 0; i--) {
        let newInst = audio.createSampler(sampleList[i], 'sounds/'+folderName);
        // newInst.volume.value = -6;
        let lpf = new Tone.Filter(20000, "lowpass").connect(masterlpf);
        let panner = new Tone.Panner3D({
            panningModel: "HRTF",
            positionX: 0,
            positionY: 0,
            refDistance: 0.1
        })

        panner.connect(lpf);
        newInst.connect(panner)
        audio.instruments.push({
            synth: newInst,
            duration: '0:2',
            panner: panner,
            lpf,
            lpf
        });
    }
}

audio.loadNumberedFolder = function(folderName, sampleCount) {
    for (var i = sampleCount; i > 0; i--) {
        let newInst = audio.createSampler(i, 'sounds/' + folderName);
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
        audio.instruments.push({
            synth: newInst,
            duration: '0:2',
            panner: panner,
            lpf,
            lpf
        });
    }
    console.log("Loaded samples from: "+folderName)
}

audio.startCurrentLoop = function (sequence, phase) {
    return new Tone.Sequence((time, note) => {
        audio.instruments[audio.currentInstrument].synth.triggerAttackRelease(note, 0.1, time);
        // subdivisions are given as subarrays
    }, sequence).start(phase);
}

audio.startLoop = function (instrument, loop, div, phase) {
    new Tone.Loop((time) => {
        instrument.synth.triggerAttackRelease(loop, 0.1, time);
    }, div).start(phase);
}

audio.startSequence = function (instrument, sequence, phase) {
    return new Tone.Sequence((time, note) => {
        if (note!=0) {
            instrument.synth.triggerAttackRelease(note, 0.1, time);
        }
        // subdivisions are given as subarrays
    }, sequence).start(phase);
}

audio.startPart = function (instrument, part, phase) {
    return new Tone.Part(((time, note) => {
        if (note != 0) {
            instrument.synth.triggerAttackRelease(note, 0.1, time);
        }
    }), part).start(phase);
}

audio.getNotesTunejs = function (scale, intervals) {
    tune.loadScale(scale);
    return tune.chord(intervals);
}

audio.onPositionChange = function(userXY, mouseXY) {
    // instruments[userId % sampleCount].panner.setPosition(usersPos[userId].x, usersPos[userId].y, 0)

    Tone.Listener.positionX = (userXY.x);
    Tone.Listener.positionY = (userXY.y);
    
    // grainer.playbackRate = abs(map(mouseX, 0, width, 0.001, 0.5));
    // grainer.overlap = abs(map(mouseX, 0, width, 0.001, 0.05));
    masterlpf.frequency.value = abs(map(mouseXY.y, 0, HEIGHT, 200, 15000));
}

audio.instruments = [];
audio.currentInstrument = 0;
let loops = [];
var tune = new Tune();

// add some effects
let reverb = new Tone.Reverb({
    decay: 0.24,
    wet: 0.2
});
reverb.generate();
reverb.connect(Tone.context.destination);
let masterlpf = new Tone.Filter(20000, "lowpass").connect(reverb);

window.onload = function () {
    console.log('Loaded!');
}
document.onclick = function () {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
    Tone.Transport.start();
}