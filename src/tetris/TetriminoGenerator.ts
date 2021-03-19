import Tetrimino from './Tetrimino.js';
import TETRIS_TETRIMINOS from './Tetriminos.js';

class TetriminoGenerator {

    /**
     * Contains a collection of tetriminos.
     */
    private bag: Tetrimino[] = [];

    /**
     * Returns a collection of every tetrimino in random order.
     * @returns {Tetrimino[]}
     */
    private getTetriminosShuffled() {

        let names: string[] = [],
            shuffledTetriminos: Tetrimino[] = [];
        
        // Get the names of every tetrimino.
        //
        for (let name in TETRIS_TETRIMINOS) {
            if (TETRIS_TETRIMINOS.hasOwnProperty(name)) {
                names.push(name);
            }
        }

        // Create a tetrimino from each name in random order and add them to the bag.
        //
        while (names.length > 0) {
            let randomTetriminoNameIndex = Math.floor(Math.random() * names.length),
                randomTetriminoName = names.splice(randomTetriminoNameIndex, 1)[0],
                tetrimino = new Tetrimino(randomTetriminoName);

            shuffledTetriminos.push(tetrimino);
        }

        return shuffledTetriminos;

    }

    /**
     * Returns a random Tetrimino object.
     * @returns {Tetrimino}
     */
    public getTetrimino() {

        // If bag is empty, seed new tetriminos.
        //
        if (this.bag.length === 0) {
            this.bag = this.getTetriminosShuffled();
        }

        // Remove the first Tetrimino from the bag and return it.
        //
        return this.bag.shift();

    }

}

export default TetriminoGenerator;