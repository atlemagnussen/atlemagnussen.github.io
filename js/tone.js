//  C, D, E, F, G, A, B
// const synth = new Tone.PolySynth(Tone.Synth, {
//     oscillator: {
//         type: "square",
//     },
// }).toDestination();
const synth = new Tone.PolySynth().toDestination();
const notes = [
    ["C4", "C5", "D5", "E5", "D5", "C5"],
    ["A3", "A4", "B4", "C5", "B4", "A4"],
    ["F3", "F4", "G4", "A4", "G4", "F4"],
    ["G3", "G4", "A4", "B4", "C5", "B4", "A4", "G4"],
];

const btnPlay = document.getElementById("btnPlay");
btnPlay.addEventListener("click", () => {
    play();
});

const btnStop = document.getElementById("btnStop");
btnStop.addEventListener("click", () => {
    stop();
});

const play = () => {
    Tone.start();
    Tone.Transport.scheduleRepeat(repeat, "8n");
    Tone.Transport.start();
};
let i = 0,
    y = 0;
function repeat(time) {
    let noteRow = notes[y];
    let note = noteRow[i];
    synth.triggerAttackRelease(note, "8n", time);
    i += 1;
    if (i === noteRow.length) {
        i = 0;
        y += 1;
    }
    if (y === notes.length) y = 0;
}

const stop = () => {
    Tone.Transport.stop();
};
