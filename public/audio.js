var isPlaying = false;
var userId;
var usersPos = {};

function createSampler(interpolation, folder) {
    return new Tone.Sampler({
        urls: {
            60: interpolation + '.wav'
        },
        baseUrl: '/' + folder + '/',
    });
}

function startLoop(getNote, delay, interval) {
    return new Tone.Loop(function (time) {
        instruments[currentInstrument].synth.triggerAttackRelease(getNote(), '1:0:0');
        if (usersPos[userId]) {
            usersPos[userId].playedAt = +new Date();
            socket.emit('line', {
                synth: 1,
                note: getNote(),
                duration: '1:0:0',
                userId: userId
            });
        }
    }, interval).start(delay);
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
    decay: 0.4,
    wet: 0.6
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