//  C, D, E, F, G, A, B
// const synth = new Tone.PolySynth(Tone.Synth, {
//     oscillator: {
//         type: "square",
//     },
// }).toDestination();
const synth = new Tone.Synth().toDestination();
const notes = ["C4", "C5", "D5", "E5", "D5", "C5", "A3", "A4", "B4", "C5", "B4", "A4"];

const btnPlay = document.getElementById("btnPlay");
btnPlay.addEventListener("click", () => {
    play();
});

const btnStop = document.getElementById("btnStop");
btnStop.addEventListener("click", () => {
    stop();
});

// const song = time => {
//     if (stopPlay) return;
//     if (counter % 2 == 0) synth.triggerAttackRelease(["C4", "E4", "A4"], "4n");
//     //if (counter % 2 == 0) synth.triggerAttackRelease("C4", "8n", time);
//     //if (counter % 4) polySynth.triggerAttackRelease("C4", "4n", time);

//     counter = (counter + 1) % 16;
// };

const play = () => {
    Tone.start();
    // pattern = new Tone.Pattern(
    //     (time, note) => {
    //         synth.triggerAttackRelease(note, 0.25, time);
    //     },
    //     ["C4", "D4", "E4", "G4", "A4"]
    // );
    // pattern.start(0);
    // loop = new Tone.Loop(function(time) {
    //     synth.triggerAttackRelease("C4", "4n", time);
    //     synth.triggerAttackRelease("D4", "4n", time + 0.25);
    // }, "1m").start(0);
    Tone.Transport.scheduleRepeat(repeat, "8n");
    Tone.Transport.start();
};
let index = 0;
function repeat(time) {
    let i = index % 12;
    let note = notes[i];
    synth.triggerAttackRelease(note, "8n", time);
    index++;
}

const stop = () => {
    Tone.Transport.stop();
};
