class BrowserGame {
    constructor(game, graphics) {
        this.game = game;
        this.graphics = graphics;
        this.updateFrequency = 30;
        this.lastTime = 0;
        if (game.input) {
            document.addEventListener('keydown', (e) => game.input(e.keyCode));
        }
        this.resume();
    }
    resume() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }
    stop() {
        window.cancelAnimationFrame(this.animationFrameId);
        this.isRunning = false;
    }
    loop(timestamp = 0) {
        const step = 1000 / this.updateFrequency, nextUpdateTime = this.lastTime + step;
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
