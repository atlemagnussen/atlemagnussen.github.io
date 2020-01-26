//  C, D, E, F, G, A, B
// const synth = new Tone.PolySynth(Tone.Synth, {
//     oscillator: {
//         type: "square",
//     },
// }).toDestination();

import * as notes from "./notes.js";

const synth = new Tone.PolySynth().toDestination();

const piano = new Tone.Sequence(
    function(time, note) {
        synth.triggerAttackRelease(note, "9n", time);
    },
    notes.piano,
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
