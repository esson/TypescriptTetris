import TETRIS_TETRIMINOS from './Tetriminos.js';
class Tetrimino {
    constructor(name) {
        this.matrix = [];
        this.name = name;
        this.matrix = TETRIS_TETRIMINOS[name].map(x => x.map(y => y));
        this.rotation = 0;
    }
    /**
     * Gets the width of the Tetrimino in blocks.
     * @returns {number} The width of the Tetrimino.
     */
    getWidth() {
        return this.matrix.length > 0 ? this.matrix[0].length : 0;
    }
    /**
     * Gets the height of the Tetrimino in blocks.
     * @returns {number} The height of the Tetrimino.
     */
    getHeight() {
        return this.matrix.length;
    }
    /**
     * Rotates the Tetrimino in the provided direction.
     * @param {number} [antiClockwise = false] - If true, tetrimino will be rotated anti-clockwise;
     */
    rotate(antiClockwise = false) {
        // Rotate the matrix clockwise.
        //
        for (let y = 0; y < this.matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [
                    this.matrix[x][y],
                    this.matrix[y][x]
                ] = [
                    this.matrix[y][x],
                    this.matrix[x][y]
                ];
            }
        }
        if (antiClockwise === true) {
            this.matrix.reverse();
        }
        else {
            this.matrix.forEach(y => y.reverse());
        }
        // Update rotation to reflect the rotation in number of degrees.
        //
        this.rotation += (antiClockwise ? -90 : 90);
        // Keep rotation as a value between 0 and 359.
        //
        while (this.rotation < 0) {
            this.rotation += 360;
        }
        this.rotation = this.rotation % 360;
    }
    /**
     * Trims the matrix by removing any edge lines/columns that are all 0.
     * @returns The Tetrimino object.
     */
    trim() {
        // Trim Lines
        //
        while (this.matrix.length && this.matrix[0].every(x => x === 0)) {
            this.matrix.shift();
        }
        while (this.matrix.length && this.matrix[this.matrix.length - 1].every(x => x === 0)) {
            this.matrix.pop();
        }
        // Trim Columns
        //
        while (this.matrix.length && this.matrix.every(x => x[0] === 0)) {
            this.matrix.forEach(x => x.shift());
        }
        while (this.matrix.length && this.matrix.every(x => x[x.length - 1] === 0)) {
            this.matrix.forEach(x => x.pop());
        }
        return this;
    }
}
export default Tetrimino;
