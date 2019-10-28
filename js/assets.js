import wiz from "./wizard.js";

class Assets {
    constructor() {
        this.loadingScreen = document.getElementById("loadingscreen");
        this.loadingMsg = document.getElementById("loadingmessage");
    }
    init() {
        this.loaded = true;
        this.loadedCount = 0;
        this.totalCount = 0;

        this.setAudioSupport();
    }
    setAudioSupport() {
        const audio = document.createElement("audio");
        this.mp3Support = false;
        this.oggSupport = false;

        if (audio.canPlayType) {
            this.mp3Support = audio.canPlayType("audio/mpeg");
            this.oggSupport = audio.canPlayType("audio/ogg: codecs = 'vorbis'");
        }

        this.soundFileExtn = this.oggSupport ? ".ogg" : this.mp3Support ? ".mp3" : undefined;
    }
    loadImg(url) {
        this.totalCount += 1;
        this.loaded = false;
        wiz.show(this.loadingScreen);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            this.itemLoaded();
        };
        return img;
    }
    loadSound(url) {
        this.totalCount += 1;
        this.loaded = false;
        wiz.show(this.loadingScreen);
        const audio = new Audio();
        audio.src = `${url}{this.soundFileExtn}`;
        audio.addEventListener("canplaythrough", () => {
            this.itemLoaded();
        }, false);
    }
    setOnLoad(onload) {
        this.onload = onload;
    }
    itemLoaded() {
        this.loadedCount += 1;
        this.loadingMsg.innerHtml = `Loaded ${this.loadedCount} of ${this.totalCount}`;
        if (this.loadedCount === this.totalCount) {
            this.loaded = true;
            wiz.hide(this.loadingScreen);
            if (this.onload) {
                this.onload();
                this.onload = null;
            }
        }
    }
}

export default new Assets();