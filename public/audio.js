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
            positionZ: 0,
            refDistance: 0.1
        })

        panner.connect(lpf);
        newInst.connect(panner)
        audio.instruments.push({
            synth: newInst,
            duration: '0:2',
            panner: panner,
            lpf,
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
            positionZ: 0,
            refDistance: 0.1
        })

        panner.connect(lpf);
        newInst.connect(panner)
        audio.instruments.push({
            synth: newInst,
            duration: '0:2',
            panner: panner,
            lpf,
        });
    }
    console.log("Loaded samples from: "+folderName)
}

audio.onPositionChanged = function(userXY, mouseXY) {
    audio.userInstruments[userId].panner.setPosition(userXY.x, userXY.y, 0)

    Tone.Listener.positionX.value = (userXY.x);
    Tone.Listener.positionY.value = (userXY.y);
    Tone.Listener.forwardZ.value = -1

    console.log('changed position')
    // grainer.playbackRate = abs(map(mouseX, 0, width, 0.001, 0.5));
    // grainer.overlap = abs(map(mouseX, 0, width, 0.001, 0.05));
    //masterlpf.frequency.value = Math.abs(map(mouseXY.y, 0, HEIGHT, 200, 15000));
}

audio.onRoomJoined = function(userId, instrument, position, usersPos) {
    let allUsers = {};
    if (usersPos === null) { 
        allUsers[userId] = position
    } else {
        allUsers = usersPos
    }


    Object.keys(allUsers).forEach(i => {
        let trackNumber = getTrackForUser(i)
        audio.userInstruments[i] = tracks[trackNumber]
        composition.handleTrackStart(trackNumber)

        tracks[getTrackForUser(i)].start()
        audio.userInstruments[i].panner.setPosition(allUsers[i].x, allUsers[i].y, 0)

        if (i === String(userId)) {
            audio.roomInstrumentName = instrument
            Tone.Listener.positionX.value = allUsers[i].x
            Tone.Listener.positionY.value = allUsers[i].y
            Tone.Listener.forwardZ.value = -1
        }
    })
}

audio.onUserLeftRoom = function(userId) {
    console.error(getTrackForUser(userId))

    composition.handleTrackStop(getTrackForUser(userId))
    delete audio.userInstruments[userId];
}

audio.instruments = [];
audio.userInstruments = {};
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
    let spaced = document.querySelector('.spaced');
    spaced.hidden = true;
    Tone.Transport.start();
    audio.isPlaying = true;
}
