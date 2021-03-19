import Tetrimino from './Tetrimino.js';
import TetriminoGenerator from './TetriminoGenerator.js';
import Tetris from './Tetris.js';
import Vector from '../core/Vector.js';

class Player {

    public lines: number;
    public tetrimino: Tetrimino;
    public queue: Tetrimino[];
    public position: Vector;
    public score: number;
    
    private drops: number;
    private generator: TetriminoGenerator;

    constructor(private tetris: Tetris) {

        this.reset();
        this.spawn();
    }

    /**
     * Tell the well to clear lines and update the score for the player.
     */
    private checkScore() {

        // Calculate the score.
        //
        const lines = this.tetris.well.clearLines();

        this.lines += lines;
        this.drops += 1;

        this.score += this.tetris.score(lines);
    }
    
    /**
     * Drops the current tetrimino by one step.
     */
    public drop() {

        this.position.y += 1;

        // If the tetrimino collides, we merge it with the well, calculate the score and re-spawn.
        //
        if (this.tetris.well.collide(this.tetrimino, this.position)) {

            // Reset position and merge.
            //
            this.position.y -= 1;
            this.tetris.well.merge(this.tetrimino, this.position);

            // Calculate the score.
            //
            this.checkScore();

            // Re-spawn.
            //
            this.spawn();
        }
    }

    /**
     * Moves the current tetrimino in the provided x direction if it doesn't collide.
     * @param {number} direction - The number of cells and direction that the tetrimino should move.
     */
    public move(direction: number) {

        this.position.x += direction;

        if (this.tetris.well.collide(this.tetrimino, this.position)) {
            this.position.x -= direction;
        }
    }

    /**
     * Gets the next tetrimino to put in play.
     * @returns {Tetrimino}
     */
    private next(): Tetrimino {

        // Get the first tetrimino from the queue or, if the queue hasn't been populated, get it from the generator.
        //
        const tetrimino = this.queue.shift() || this.generator.getTetrimino();

        // Fill the queue.
        //
        while (this.queue.length < 3) {
            this.queue.push(this.generator.getTetrimino());
        }

        return tetrimino;
    }

    /**
     * Resets the Player to its initial state.
     */
    public reset() {

        this.lines = 0;
        this.drops = 0;
        this.score = 0;
        this.queue = [];
        this.generator = new TetriminoGenerator();
        this.spawn();
    }

    /**
     * Rotates the current tetrimino in the provided direction and adjusts the position so that it doesn't collide.
     * @param {number} direction - A positive or negative number deciding the direction of the rotation.
     */
    public rotate(direction: number) {

        const antiClockwise = direction < 0;

        // Store the intial position, so that we can reset.
        const position = this.position.x;
        
        // Rotate the Tetriminio.
        //
        this.tetrimino.rotate(antiClockwise);

        // Wall Kick - Move tetrimino sideways until it doesn't collide.
        //
        
        // Offset that is used to find a non-colliding position for the rotated tetrimino.
        let offset = 1;

        while (this.tetris.well.collide(this.tetrimino, this.position)) {

            // Move the tetrimino by the offset.
            //
            this.position.x += offset;
            
            // Increase the offset and invert it, to adjust the position the other way.
            //
            if (offset > 0) {
                offset = -(offset + 1);
            } else {
                offset = -(offset - 1)
            }

            // If the offset is larger than the width of the tetrimino, reset the rotation and return to the original position.
            //
            if (offset > this.tetrimino.getWidth()) {
                this.tetrimino.rotate(!antiClockwise);
                this.position.x = position;
                return;
            }
        }
    }

    /**
     * Spawns a new tetrimino and set it at the starting point. Checks if game is lost.
     */
    private spawn() {

        // Put the next tetrimino in play.
        //
        this.tetrimino = this.next();

        // Set the inital position, top centered in well.
        //
        this.position = new Vector(
            Math.floor(this.tetris.well.getWidth() / 2) - Math.floor(this.tetrimino.matrix[0].length / 2),
            0
        );

        // If we collide immediately, game is lost.
        //
        if (this.tetris.well.collide(this.tetrimino, this.position)) {
            this.tetris.end();
        }

    }

}

export default Player;