import IAnimation from './IAnimation.js';

class Animation implements IAnimation {
    
    private previousTimestamp: number;
    private animationTimeElapsed: number = 0;
    
    public isCompleted: boolean = false;

    /**
     * @constructor
     * @param {number} duration - The duration of time in ms that the animation will run.
     * @param {Function} drawCallback - Callback function with timeElapsed as parameter.
     */
    constructor(
        private duration: number,
        private drawCallback: (animationTimeElapsed: number) => void
    ) {
        
    }

    /**
     * Draws the next frame of the animation, using the drawCallback.
     * The timeElapsed parameter provided to the callback will be between 0 and the duration.
     * @param {number} The timestamp.
     */
    public draw(timestamp: number) {

        if (!this.previousTimestamp) {
            this.previousTimestamp = timestamp;
        }

        const deltaTime = timestamp - this.previousTimestamp;
       
        if (this.animationTimeElapsed + deltaTime <= this.duration) {
            this.animationTimeElapsed += timestamp - this.previousTimestamp;
            this.previousTimestamp = timestamp;
        } else {
            this.isCompleted = true;
        }
        
        this.drawCallback(this.animationTimeElapsed);
    }
}

export default Animation;