var isPlaying = false;

function createSampler(interpolation, folder) {
    return new Tone.Sampler({
        urls: {
            60: interpolation + '.wav'
        },
        baseUrl: '/' + folder + '/',
    });
}

function createInstrument(loadKeys, folder) {
    let defnotes = ['c','cs','d','ds','e','f','fs','g','gs','a','as','b'];
    let urls = {};
    for (let index = 0; index < loadKeys.length; index++) {
        let keyNum = loadKeys[index] + 60;
        const element = loadKeys[index];
        var octave = 3;
        switch (true) {
            case (element < 48 && element >= 36):
                octave = 1;
                break;
            case (element < 60 && element >= 48):
                octave = 2;
                break;
            case (element < 84 && element >= 72):
                octave = 4;
                break;
            case (element < 96 && element >= 84):
                octave = 5;
                break;
            default:
                octave = 3;
        }
        urls[keyNum] = defnotes[element] + octave + '.wav';
    }
    return urls;
    // var sampler = new Tone.Sampler({
    //     urls: urls,
    //     baseUrl: '/' + folder + '/',
    // });
    // let lpf = new Tone.Filter(600, "lowpass").connect(masterlpf);
    // let panner = new Tone.Panner3D({
    //     panningModel: "HRTF",
    //     positionX: 0,
    //     positionY: 0,
    //     refDistance: 0.1
    // })

    // panner.connect(lpf);
    // sampler.connect(panner)
    // return {
    //     synth: sampler,
    //     duration: '0:2',
    //     panner: panner,
    //     lpf,
    //     lpf
    // };
}

function loadFolder(folderName, sampleList) {
    for (var i = sampleList.count; i > 0; i--) {
        let newInst = createSampler(sampleList[i], 'sounds/'+folderName);
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
}

function loadNumberedFolder(folderName, sampleCount) {
    for (var i = sampleCount; i > 0; i--) {
        let newInst = createSampler(i, 'sounds/' + folderName);
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
    console.log("Loaded samples from: "+folderName)
}

function startCurrentLoop(getNote, delay, interval) {
    return new Tone.Loop(function (time) {
        instruments[currentInstrument].synth.triggerAttackRelease(getNote(), '1:0:0');
        usersPos[userId].playedAt = +new Date();
        socket.emit('line', {
            synth: 1,
            note: getNote(),
            duration: '1:0:0',
            userId: userId
        });
    }, interval).start(delay);
}

function startLoop(instrument, getNote, delay, interval) {
    return new Tone.Loop(function (time) {
        instrument.synth.triggerAttackRelease(getNote(), '1:0:0');
    }, interval).start(delay);
}

function startLoop(instrument, getNote, delay, interval, user) {
    return new Tone.Loop(function (time) {
        instrument.synth.triggerAttackRelease(getNote(), '1:0:0');
        usersPos[user].playedAt = +new Date();
    }, interval).start(delay);
}

function startSeq(instrument, noteList, delay) {
    return new Tone.Sequence((time, note) => {
        instrument.synth.triggerAttackRelease(note, 0.1, time);
        usersPos[userId].playedAt = +new Date();
    }, noteList()).start(delay);
}

function startSeqUser(instrument, noteList, delay, user) {
    return new Tone.Sequence((time, note) => {
        instrument.synth.triggerAttackRelease(note, 0.1, time);
        usersPos[user].playedAt = +new Date();
    }, noteList()).start(delay);
}

function getNotesTunejs(scale, intervals) {
    tune.loadScale(scale);
    return tune.chord(intervals);
}

var instruments = [];
var currentInstrument = 0;
let loops = [];
var tune = new Tune();

// add some effects
let reverb = new Tone.Reverb({
    decay: 0.24,
    wet: 0.2
});
reverb.generate();
reverb.connect(Tone.context.destination);
let masterlpf = new Tone.Filter(8000, "lowpass").connect(reverb);

window.onload = function () {
    console.log('Loaded!');
}
document.onclick = function () {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
    Tone.Transport.start();
}