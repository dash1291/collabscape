let audio = {};
audio.isPlaying = false

audio.createSampler = function(interpolation, folder) {
    return new Tone.Sampler({
        urls: {
            60: interpolation + '.wav'
        },
        baseUrl: assetPaths + '/' + folder + '/',
    });
}

audio.createInstrument = function (folderName, loadKeys) {
    let defnotes = ['c','cs','d','ds','e','f','fs','g','gs','a','as','b'];
    let urls = {};
    for (let index = 0; index < loadKeys.length; index++) {
        let midiNum = loadKeys[index] + 60;
        let keyNum = loadKeys[index];
        let octave = Math.floor((keyNum + 36) / 12);
        let note = defnotes[(keyNum + 36) % 12];
        urls[midiNum] = note + octave + '.wav';
    }
    // return urls;
    let sampler = new Tone.Sampler({
        urls: urls,
        baseUrl: assetPaths + '/sounds/' + folderName + '/',
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
    for (let i = sampleList.count; i > 0; i--) {
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
    for (let i = sampleCount; i > 0; i--) {
        let newInst = audio.createSampler(i, 'sounds/' + folderName);
        // newInst.volume.value = -6;
        let lpf = new Tone.Filter(12000, "lowpass").connect(masterlpf);
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

audio.onPositionChanged = function(userXY, mouseXY) {
    // audio.instruments[userId % sampleCount].panner.setPosition(usersPos[userId].x, usersPos[userId].y, 0)

    Tone.Listener.positionX = (userXY.x);
    Tone.Listener.positionY = (userXY.y);
}

audio.onRoomJoined = function(userId, instrument, position, usersPos) {
    Tone.Listener.positionX = position.x;
    Tone.Listener.positionY = position.y
    Tone.Listener.forwardZ = -1

    audio.roomInstrumentName = instrument

    if (audio.instruments[instrument]) {
        audio.instruments[instrument].panner.setPosition(position.x, position.y, 0)

        usersPos = msg.usersPos
        Object.keys(usersPos).forEach(i => {
            audio.instruments[i % audio.instruments.length].panner.setPosition(usersPos[i].x, usersPos[i].y, 0)
        })
    }
}

audio.instruments = [];

audio.currentInstrument = 0;

// add some effects
let reverb = new Tone.Reverb({
    decay: 0.7,
    wet: 0.7
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
    audio.isPlaying = true;
}
