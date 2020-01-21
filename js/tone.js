const synth = new Tone.Synth().toMaster();
let loopBeat;
let bassSynth;
let counter = 0;

const btnPlay = document.getElementById("btnPlay");
btnPlay.addEventListener("click", () => {
    play();
});

const btnStop = document.getElementById("btnStop");
btnStop.addEventListener("click", () => {
    stop();
});

const song = time => {
    if (counter % 2 == 0) synth.triggerAttackRelease("C4", "8n", time);
    if (counter % 4) bassSynth.triggerAttackRelease("Gb3", "4n", time);

    counter = (counter + 1) % 16;
};

const play = () => {
    bassSynth = new Tone.MembraneSynth().toDestination();
    loopBeat = new Tone.Loop(song, "4n");

    Tone.Transport.start();
    loopBeat.start(0);
};

const stop = () => {
    synth.triggerRelease();
};

//const outputTime = document.getElementById("time");
// function updateTime() {
//     requestAnimationFrame(updateTime);
//     outputTime.textContent = Tone.context.currentTime.toFixed(3);
// }
//updateTime();
