import Tetris from '../Tetris.js';

export class AudioController {
    theme: HtmlAudio;

    constructor(tetris: Tetris) {
        this.theme = new HtmlAudio('audio/tetris.mp3', true);

        tetris.subscribe('starting', (event: string, value: any) => { this.theme.start(); });
        tetris.subscribe('paused', (event: string, value: boolean) => { value ? this.theme.pause() : this.theme.unpause(); });
        tetris.subscribe('gameover', (event: string, value: any) => { this.theme.stop(); });
    }


}

class HtmlAudio {
    audioElement: HTMLAudioElement
    
    constructor(filename: string, loop: boolean) {
        this.audioElement = document.createElement("audio");
        this.audioElement.src = filename;
        this.audioElement.loop = loop;
    }

    public start() {
        this.audioElement.play();
    }

    public pause() {
        this.audioElement.pause();
    }

    public unpause() {
        this.audioElement.play();
    }

    public stop() {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
    }
}