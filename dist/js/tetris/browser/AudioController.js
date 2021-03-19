export class AudioController {
    constructor(tetris) {
        this.theme = new HtmlAudio('audio/tetris.mp3', true);
        tetris.subscribe('starting', (event, value) => { this.theme.start(); });
        tetris.subscribe('paused', (event, value) => { value ? this.theme.pause() : this.theme.unpause(); });
        tetris.subscribe('gameover', (event, value) => { this.theme.stop(); });
    }
}
class HtmlAudio {
    constructor(filename, loop) {
        this.audioElement = document.createElement("audio");
        this.audioElement.src = filename;
        this.audioElement.loop = loop;
    }
    start() {
        this.audioElement.play();
    }
    pause() {
        this.audioElement.pause();
    }
    unpause() {
        this.audioElement.play();
    }
    stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }
}
