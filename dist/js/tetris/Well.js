class Well {
    /**
     * @constructor
     * Creates a new well for playing Tetris on.
     * @param {number} [width = 10] The width of the well in number of columns.
     * @param {number} [height = 22] The height of the well in number of lines.
     */
    constructor(width = 10, height = 22) {
        /**
         * @property {number[][]} A matrix holding the merged tetriminos.
         */
        this.matrix = [];
        // Add the lines (height).
        //
        for (let y = 0; y < height; y++) {
            // Add the columns (width).
            //  
            let columns = [];
            for (let x = 0; x < width; x++) {
                columns.push(0);
            }
            this.matrix.push(columns);
        }
    }
    /**
     * Gets the width of the well in columns.
     * @returns {number} The width of the well.
     */
    getWidth() {
        return this.matrix.length > 0 ? this.matrix[0].length : 0;
    }
    /**
     * Gets the height of the well in lines.
     * @returns {number} The height of the well.
     */
    getHeight() {
        return this.matrix.length;
    }
    /**
     * Removes the completed lines from the well and returns the number of lines that was removed.
     * @returns {number} The number of completed lines.
     */
    clearLines() {
        let lines = 0;
        // Iterate in reverse, as we'll be removing lines.
        //
        for (let y = this.matrix.length - 1; y > 0; y--) {
            // If we didn't find any empty cells, the line is completed.
            //
            if (this.matrix[y].every(x => x !== 0)) {
                // Remove the line from the matrix.
                //
                const line = this.matrix.splice(y, 1)[0];
                // Insert the line at the top, but with only 0.
                //
                this.matrix.unshift(line.map(x => 0));
                // Increase the y as the lines have shifted and we'll need to 
                // read the same position again.
                //
                y += 1;
                // Update the counter.
                //
                lines += 1;
            }
        }
        return lines;
    }
    /**
     * Check if the provided tetrimino at the provided position collides with any filled cell in the well.
     * @param {Tetrimino} tetrimino - The tetrimino to chech for collision.
     * @param (Vector) pos - The current position of the tetrimino.
     */
    collide(tetrimino, position) {
        const wellMatrix = this.matrix, tetriminoMatrix = tetrimino.matrix;
        for (let y = 0; y < tetriminoMatrix.length; y++) {
            for (let x = 0; x < tetriminoMatrix[y].length; x++) {
                // If the current cell in the tetrimino has a value, we check it 
                // against the well.
                //
                if (tetriminoMatrix[y][x] !== 0) {
                    // If the position is outside the well or if the position is 
                    // occupied, we return true.
                    //
                    if (!wellMatrix[position.y + y] || wellMatrix[position.y + y][position.x + x] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Merges the tetrimino into the well at the given position.
     * @param {Tetrimino} tetrimino - The tetrimino to merge into the well.
     * @param {Vector} position - The position at which the tetrimino will be placed.
     */
    merge(tetrimino, position) {
        const wellMatrix = this.matrix, tetriminoMatrix = tetrimino.matrix;
        for (let y = 0; y < tetriminoMatrix.length; y++) {
            for (let x = 0; x < tetriminoMatrix[y].length; x++) {
                if (tetriminoMatrix[y][x] !== 0 && wellMatrix[position.y + y]) {
                    wellMatrix[position.y + y][position.x + x] = tetriminoMatrix[y][x];
                }
            }
        }
    }
    /**
     * Resets the well to its initial state.
     */
    reset() {
        this.matrix = this.matrix.map(y => y.map(x => 0));
    }
}
export default Well;
