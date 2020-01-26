const notes = {
    piano: [
        ["C4", "C5", "D5", "E5", "D5", "C5"],
        ["A3", "A4", "B4", "C5", "B4", "A4"],
        ["F3", "F4", "G4", "A4", "G4", "F4"],
        ["G3", "G4", "A4", "B4", "C5", "B4", "A4", "G4"],
    ],
};

export const piano = notes.piano
    .map(arr => {
        return arr;
    })
    .reduce((a, b) => {
        return a.concat(b);
    }, []);
