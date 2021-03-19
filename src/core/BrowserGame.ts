import IGame from './IGame.js';
import IGraphics from './IGraphics.js';

class BrowserGame {

    private updateFrequency: number = 30;
    private lastTime: number = 0;

    private animationFrameId: number;
    private isRunning: boolean;

    constructor(private game: IGame, private graphics: IGraphics) {

        if (game.input) {
            document.addEventListener('keydown', (e) => game.input(e.keyCode));
        }

        this.resume();
    }

    public resume() {

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    public stop() {

        window.cancelAnimationFrame(this.animationFrameId);
        this.isRunning = false;
    }

    private loop(timestamp: number = 0) {

        const step = 1000 / this.updateFrequency,
              nextUpdateTime = this.lastTime + step;

        let stepsToSimulate = 0;

        if (timestamp > nextUpdateTime) {
            const deltaTime = timestamp - this.lastTime;
            stepsToSimulate = Math.floor(deltaTime / step);
        }

        // Update.
        //
        while (stepsToSimulate--) {
            this.lastTime = this.lastTime + (1000 / this.updateFrequency);
            this.game.update(1000 / this.updateFrequency);
        }

        // Draw.
        //
        this.graphics.draw(timestamp);

        // Continue.
        //
        this.animationFrameId = window.requestAnimationFrame((timestamp) => this.loop(timestamp));
    }

}

export default BrowserGame;