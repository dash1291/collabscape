// Inspired by the work of David Bouchard at 
// https://deadpixel.ca/
//------------------------------------------------------------
class Track {
    constructor(
        scale = 'ji_12',
        noteDuration = "8n",
        transpose = 0,
        phase = 0,
    ) {
        this.transpose = transpose; // this will shift the sequence by a number of notes

        this.scale = new Tune();
        this.scale.loadScale(scale);
        this.noteDuration = noteDuration;
        this.phase = phase;
        this.patternLength = 0;
        this.sequences = [];
        this.sequenceLengths = [];

        // Every track gets its own synth
        this.synth = new Tone.Synth();
        this.synth.toDestination();

        // This variable holds the current note being played. This is useful
        // for visualizatons
        this.currentNote;
    }

    addPattern(patternNotes, patternType = "up") {
        this.patternType = patternType;
        this.patternLength = patternNotes.length;
        // This is our repeating Pattern object
        this.pattern = new Tone.Pattern((time, index) => {
                this.playNote(index, time);
            },
            // This array simply contains [0, 1, 2, 3, ...] etc
            patternNotes,
            // patternTypes:
            // "up" | "down" | "upDown" | "downUp" |
            // "alternateUp" | "alternateDown" |
            // "random" | "randomOnce" | "randomWalk"
            patternType
        );

        this.pattern.interval = "8n";
    }

    addSequence(sequenceNotes) {
        let splitSequence = sequenceNotes.trim().split(' '); // Get tidal like splitting
        let sequence = new Tone.Sequence((time, note) => {
            if (note != '~') { // Don't play a note on ~ (like Tidal)
                this.playNote(Number(note), time);
            }
            // subdivisions are given as subarrays
        }, splitSequence);
        this.sequences.push(sequence);
        this.sequenceLengths.push(splitSequence.length);
    }

    addSequences(sequences) {
        sequences.forEach(element => {
            this.addSequence(element);
        });
    }

    removeSequence(index) {
        if (this.sequences[index]) {
            this.sequences[index].clear();
            delete this.sequences[index];
            delete this.sequenceLengths[index];
        }
    }

    humanize(val = true) {
        this.sequences.forEach(sequence => {
            sequence.humanize = val;
        })
    }

    loop(val = 1) {
        this.sequences.forEach(sequence => {
            sequence.loop = true;
            sequence.loopEnd = val;
        })
    }

    playbackRate(val = 1) {
        this.sequences.forEach(sequence => {
            sequence.playbackRate = val;
        })
    }

    probability(val = 1) {
        this.sequences.forEach(sequence => {
            sequence.probability = val;
        })
    }

    playNote(index, time) {
        let note = this.scale.note(index + 60 + this.transpose);
        this.synth.triggerAttackRelease(note, this.noteDuration, time);
        // socket.emit('line', { note: note, duration: duration, userId: userId });
        this.currentNote = note;
    }

    movePhase(val = 0) {
        this.stop();
        this.phase = val;
        this.start();
    }

    loadScale(scale = 'ji_12') {
        this.scale.loadScale(scale);
    }

    start(offset = 0) {
        if (this.pattern !== undefined) {
            let patternPhase = (1 / this.patternLength) * this.phase;
            if (offset)
                this.pattern.start(offset);
            else
                this.pattern.start(patternPhase);
        }
        if (this.sequences.length) {
            this.sequences.forEach((sequence, index) => {
                let sequencePhase = (1 / this.sequenceLengths[index]) * this.phase;
                if (offset)
                    sequence.start(offset);
                else
                    sequence.start(sequencePhase);
            });
        }
    }

    stop() {
        if (this.pattern !== undefined) {
            let patternPhase = (1 / patternLength) * this.phase;
            this.pattern.stop(patternPhase);
        }
        if (this.sequences.length) {
            this.sequences.forEach((sequence, index) => {
                let sequencePhase = (1 / this.sequenceLengths[index]) * this.phase;
                sequence.stop(sequencePhase);
            });
        }
    }

    rampStart() {
        this.start();
        this.synth.volume.rampTo(-3, 8);
    }

    rampStop() {
        this.stop();
        this.synth.volume.rampTo(-Infinity, 4);
    }
}

//------------------------------------------------------------
// "Proper" modulo operation.  In Javascript, % actually returns
// the remainder of a division, which means it can give you negative
// values
// This function will only return positive numbers between 0 and m 
function modulo(n, m) {
    return ((n % m) + m) % m;
}