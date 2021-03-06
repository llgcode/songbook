
var song = document.getElementById("song-view");

var fontSize = 100;
var biggerButton = document.getElementById("biggerButton");
biggerButton.addEventListener("click", (e) => {
    fontSize += 10;
    song.style.fontSize = fontSize + "%";
});
var smallerButton = document.getElementById("smallerButton");
smallerButton.addEventListener("click", (e) => {
    fontSize -= 10;
    song.style.fontSize = fontSize + "%";
});

// FullScreen
var fullScreenButton = document.getElementById("fullScreenButton");
fullScreenButton.addEventListener("click", (e) => {
    if (isFullScreen()) {
        exitFullScreen();
    } else {
        requestFullScreen(document.body);
    }
});

var fullscreenChange = () => {
    if (isFullScreen()) {
        (<HTMLElement>fullScreenButton).classList.add("active");
    } else {
        (<HTMLElement>fullScreenButton).classList.remove("active");
    }
};

document.addEventListener("fullscreenchange ", fullscreenChange);
document.addEventListener("webkitfullscreenchange", fullscreenChange);
document.addEventListener("mozfullscreenchange", fullscreenChange);
document.addEventListener("MSFullscreenChange", fullscreenChange);

function isFullScreen(): boolean {
    if (document["isFullScreen"]) {
        return document["isFullScreen"]
    } else if (document["webkitIsFullScreen"]) {
        return document["webkitIsFullScreen"]
    } else if (document["mozFullScreen"]) {
        return document["mozFullScreen"]
    }
}

function exitFullScreen(): boolean {
    if (document["exitFullscreen"]) {
        return document["exitFullscreen"]()
    } else if (document["webkitExitFullscreen"]) {
        return document["webkitExitFullscreen"]()
    } else if (document["mozCancelFullScreen"]) {
        return document["mozCancelFullScreen"]()
    }
}

function requestFullScreen(element: HTMLElement) {
    if (element["requestFullScreen"]) {
        element["requestFullScreen"]()
    } else if (element["webkitRequestFullScreen"]) {
        element["webkitRequestFullScreen"]()
    } else if (element["mozRequestFullScreen"]) {
        element["mozRequestFullScreen"]()
    }
}

// Restore two column current user pref
var songWidth = song.clientWidth;
var songHeight = song.clientHeight;
var updateColumn = () => {
    var needColumn = songWidth < window.innerWidth /2;
    needColumn = needColumn && songHeight > window.innerHeight;
    var songContent = <HTMLElement>song.querySelector(".song-content");
    if (needColumn) {
        songContent.classList.add("song-column");
    } else {
        songContent.classList.remove("song-column");
    }
};
window.addEventListener("resize", updateColumn);
updateColumn();

// Transposition
var transposeCount = 0;
var musicalKey = null
var transposeDisplay = document.getElementById("transposeDisplay");
var musicalKeyElt = song.querySelector(".song-metadata-value[itemprop=musicalKey]");
if (musicalKeyElt) {
    musicalKey = musicalKeyElt.textContent;
    transposeDisplay.innerHTML = musicalKey
} else {
    transposeDisplay.innerHTML = "0";
}

var forEachNode = function (list: NodeList, callback: (node: Node)=>void, context?: any){
    return Array.prototype.forEach.call(list, callback, context);
};

var transposeLessButton = document.getElementById("transposeLessButton");
transposeLessButton.addEventListener("click", (e) => {
    transposeAll(-1);
});

var transposeMoreButton = document.getElementById("transposeMoreButton");
transposeMoreButton.addEventListener("click", (e) => {
    transposeAll(1);
});

function transposeAll(count: number) {
    transposeCount+=count;
    forEachNode(song.querySelectorAll(".song-chord"), (chordElt: HTMLElement) => {
        chordElt.textContent = transpose(chordElt.textContent, count);
    });
    if (musicalKey) {
        transposeDisplay.innerHTML = transpose(musicalKey, transposeCount);
    } else {
        transposeDisplay.innerHTML = transposeCount + "";
    }
}


var notesIndexes = {
    "C" : 0,
    "C#": 1,
    "Db": 1,
    "D" : 2,
    "D#": 3,
    "Eb": 3,
    "E" : 4,
    "F" : 5,
    "F#": 6,
    "Gb": 6,
    "G" : 7,
    "G#": 8,
    "Ab": 8,
    "A" : 9,
    "A#": 10,
    "Bb": 10,
    "B" : 11
}

var notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function transpose(chord: string, demiToneCount: number): string {
    var note = chord[0];
    if (chord.length > 1 && (chord[1] === "b" || chord[1] === "#")) {
        note += chord[1];
    }

    var newNote = notes[getNoteIndex(notesIndexes[note]+demiToneCount)];
    var indexOfBass = chord.indexOf("/");
    if (indexOfBass !== -1 && indexOfBass < chord.length - 1) {
        chord = chord.substring(0, indexOfBass+1) + transpose(chord.substring(indexOfBass+1), demiToneCount);
    }
    return newNote + chord.substring(note.length);
}

function getNoteIndex(i: number): number {
    if (i < 0) {
        return getNoteIndex(12 + i);
    }
    if (i >= 12) {
        return getNoteIndex(i - 12);
    }
    return i;
}

