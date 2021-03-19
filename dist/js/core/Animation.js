class Animation {
    /**
     * @constructor
     * @param {number} duration - The duration of time in ms that the animation will run.
     * @param {Function} drawCallback - Callback function with timeElapsed as parameter.
     */
    constructor(duration, drawCallback) {
        this.duration = duration;
        this.drawCallback = drawCallback;
        this.animationTimeElapsed = 0;
        this.isCompleted = false;
    }
    /**
     * Draws the next frame of the animation, using the drawCallback.
     * The timeElapsed parameter provided to the callback will be between 0 and the duration.
     * @param {number} The timestamp.
     */
    draw(timestamp) {
        if (!this.previousTimestamp) {
            this.previousTimestamp = timestamp;
        }
        const deltaTime = timestamp - this.previousTimestamp;
        if (this.animationTimeElapsed + deltaTime <= this.duration) {
            this.animationTimeElapsed += timestamp - this.previousTimestamp;
            this.previousTimestamp = timestamp;
        }
        else {
            this.isCompleted = true;
        }
        this.drawCallback(this.animationTimeElapsed);
    }
}
export default Animation;
