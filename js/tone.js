//  C, D, E, F, G, A, B
// const synth = new Tone.PolySynth(Tone.Synth, {
//     oscillator: {
//         type: "square",
//     },
// }).toDestination();

import * as notes from "./notes.js";

const synth = new Tone.PolySynth().toDestination();

const bassOptions = {
    volume: -5,
    oscillator: {
        type: "fmsquare5",
        modulationType: "triangle",
        modulationIndex: 2,
        harmonicity: 0.501,
    },
    filter: {
        Q: 1,
        type: "lowpass",
        rolloff: -24,
    },
    envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 2,
    },
    filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.8,
        release: 1.5,
        baseFrequency: 50,
        octaves: 4.4,
    },
};
const bassSynth = new Tone.MonoSynth(bassOptions).toDestination();

const piano = new Tone.Sequence(
    (time, note) => {
        synth.triggerAttackRelease(note, "9n", time);
    },
    notes.piano,
    "8n"
);

const bass = new Tone.Sequence(
    function(time, note) {
        bassSynth.triggerAttackRelease(note, "6n", time);
    },
    notes.bass,
    "8n"
);

const btnPlay = document.getElementById("btnPlay");
btnPlay.addEventListener("click", () => {
    toggle();
});
const btnMute = document.getElementById("btnMute");
btnMute.addEventListener("click", () => {
    mute();
});
const toggle = () => {
    if (btnPlay.textContent === "play") {
        btnPlay.textContent = "stop";
        play();
    } else {
        btnPlay.textContent = "play";
        Tone.Transport.stop();
        piano.stop();
    }
};

const play = () => {
    piano.start();
    bass.start();
    Tone.start();
    // Tone.Transport.bpm.value = 200; //120 default
    Tone.Transport.start("+0.1");
};

const mute = () => {
    if (btnMute.textContent === "mute") {
        btnMute.textContent = "unmute";
        Tone.Destination.mute = true;
    } else {
        btnMute.textContent = "mute";
        Tone.Destination.mute = false;
    }
};
