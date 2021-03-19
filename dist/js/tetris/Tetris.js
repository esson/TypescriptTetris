import Well from './Well.js';
import TetrisState from './TetrisState.js';
import Player from './Player.js';
import Vector from '../core/Vector.js';
const TETRIS_HIGHSCORE_KEY = 'Tetris:Highscore';
const TETRIS_DROPINTERVAL = 1000;
const TETRIS_LINESCORES = [0, 40, 100, 300, 1200];
const TETRIS_LEVEL_DROPINTERVAL_INCREASE = 25;
const TETRIS_LINES_PER_LEVEL = 10;
const KEY_SPACE = 32;
const KEY_ENTER = 13;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
class Tetris {
    constructor(columns = 10, lines = 24, storage = window.localStorage) {
        this.storage = storage;
        this.timeSinceLastDrop = 0;
        this.dropInterval = 1000;
        this.highscoreSubscriptionDelivered = false;
        this.subscriptions = {};
        this.columns = columns;
        this.lines = lines;
        this.well = new Well(columns, lines);
        this.player = new Player(this);
        this.syncHighscore();
        this.reset();
    }
    /**
     * Makes the Player drop the tetrimino and resets timeSinceLastDrop to 0.
     */
    drop() {
        // Make the player drop.
        //
        this.player.drop();
        // Reset timeSinceLastDrop.
        //
        this.timeSinceLastDrop = 0;
        // Sync the highscore with the players current score.
        //
        this.syncHighscore();
        // Update the difficulty.
        //
        const level = Math.floor(this.player.lines / TETRIS_LINES_PER_LEVEL);
        if (level > this.level) {
            this.level = level;
            this.dropInterval = TETRIS_DROPINTERVAL - (this.level * TETRIS_LEVEL_DROPINTERVAL_INCREASE);
            this.deliverMessage('level', level);
        }
    }
    /**
     * Makes the Player drop the tetrimino until it collides.
     */
    dropHard() {
        const dropVector = new Vector(0, 1);
        while (!this.well.collide(this.player.tetrimino, this.player.position.add(dropVector))) {
            this.drop();
        }
        this.drop();
    }
    /**
     * Ends the game.
     */
    end() {
        this.state = TetrisState.Ended;
        this.deliverMessage('gameover');
    }
    /**
     * Resets the game.
     */
    reset() {
        this.state = TetrisState.Start;
        this.level = 0;
        this.dropInterval = TETRIS_DROPINTERVAL;
        this.timeSinceLastDrop = 0;
        this.highscoreSubscriptionDelivered = false;
        this.perfectClears = 0;
        this.well.reset();
        this.player.reset();
    }
    /**
     * Pauses the game.
     */
    pause() {
        this.state = TetrisState.Paused;
        this.deliverMessage('paused', true);
    }
    /**
     * Starts the game.
     */
    start() {
        this.state = TetrisState.Gameplay;
        this.deliverMessage('starting');
    }
    /**
     * Unpauses the game.
     */
    unpause() {
        this.state = TetrisState.Gameplay;
        this.timeSinceLastDrop = 0;
        this.deliverMessage('paused', false);
    }
    /**
     * Delivers a message to any subscribers for that message.
     * @param {string} event - The message.
     * @param {any} value - The value associated with the message.
     */
    deliverMessage(message, value) {
        const subscriptions = this.subscriptions[message];
        if (typeof subscriptions === 'undefined') {
            return;
        }
        subscriptions.forEach((subscriptionFn) => {
            subscriptionFn(message, value);
        });
    }
    /**
     * Subscribe to messages sent during the game.
     * @param {string} event - The message to subscribe to.
     * @param {Function} subscriptionFn - Callback function to be executed when the message is sent.
     */
    subscribe(event, subscriptionFn) {
        let subscriptions = this.subscriptions[event];
        if (typeof subscriptions === 'undefined') {
            this.subscriptions[event] = subscriptions = [];
        }
        subscriptions.push(subscriptionFn);
    }
    /**
     * Updates the highscore and stores it to the current storage.
     */
    syncHighscore() {
        // If highscore isn't initialized, load it from storage or initialize with 0.
        //
        if (this.highscore == null) {
            this.highscore = parseInt(this.storage.getItem(TETRIS_HIGHSCORE_KEY) || '0', 10);
        }
        // If player score is a new highscore...
        //
        if (this.player.score > this.highscore) {
            // Update highscore and store the value to storage.
            //
            this.highscore = this.player.score;
            this.storage.setItem(TETRIS_HIGHSCORE_KEY, this.highscore.toString());
            // If we haven't already delivered the message, deliver the message.
            //
            if (this.highscoreSubscriptionDelivered === false) {
                this.deliverMessage('highscore', this.highscore);
                this.highscoreSubscriptionDelivered = true;
            }
        }
    }
    /**
     * Update method to call from a game loop.
     * @param {number} timeElapsed - The time elapsed since the previous loop.
     */
    update(timeElapsed) {
        if (this.state !== TetrisState.Gameplay) {
            return;
        }
        // Add the timeElapsed to timeSinceLastDrop.
        this.timeSinceLastDrop += timeElapsed;
        // If the timeSinceLastDrop exceeds the current dropInterval, make an automatic drop.
        //
        if (this.timeSinceLastDrop > this.dropInterval) {
            this.drop();
        }
    }
    /**
     * Calculates the score for the provided number of completed lines.
     * @param {number} completedLines - The number of lines completed.
     */
    score(completedLines) {
        let score = TETRIS_LINESCORES[completedLines];
        if (isNaN(score)) {
            score = 0;
        }
        else {
            score * (this.level + 1);
        }
        // Check for Perfect Clear.
        // HACK: Refactoring should be done so that Tetris object clears the lines of the well. This check should be done when that occurs.
        //
        if (!this.well.matrix.some(y => y.some(x => x > 0))) {
            this.perfectClears += 1;
            this.deliverMessage('perfectclear', this.perfectClears);
        }
        return score;
    }
    /**
     * Handles input from the player.
     * @param {number} keyCode - The key code for the key that was pressed.
     */
    input(keyCode) {
        switch (this.state) {
            case TetrisState.Start:
                this.inputStart(keyCode);
                break;
            case TetrisState.Ended:
                this.inputEnded(keyCode);
                break;
            case TetrisState.Paused:
                this.inputPaused(keyCode);
                break;
            case TetrisState.Gameplay:
                this.inputGameplay(keyCode);
                break;
        }
    }
    /**
     * Handles input from the player before the game is started.
     * @param {number} keyCode - The key code for the key that was pressed.
     */
    inputStart(keyCode) {
        if (keyCode === KEY_ENTER) {
            this.start();
        }
    }
    /**
     * Handles input from the player when the game is ended.
     * @param {number} keyCode - The key code for the key that was pressed.
     */
    inputEnded(keyCode) {
        if (keyCode === KEY_ENTER) {
            this.reset();
        }
    }
    /**
     * Handles input from the player when the game is paused.
     * @param {number} keyCode - The key code for the key that was pressed.
     */
    inputPaused(keyCode) {
        if (keyCode === KEY_ENTER) {
            this.unpause();
        }
    }
    /**
     * Handles input from the player while the game is running.
     * @param {number} keyCode - The key code for the key that was pressed.
     */
    inputGameplay(keyCode) {
        if (keyCode == KEY_UP) {
            this.player.rotate(1);
        }
        else if (keyCode == KEY_LEFT) {
            this.player.move(-1);
        }
        else if (keyCode == KEY_RIGHT) {
            this.player.move(1);
        }
        else if (keyCode == KEY_DOWN) {
            this.drop();
        }
        else if (keyCode == KEY_SPACE) {
            this.dropHard();
        }
        else if (keyCode === KEY_ENTER) {
            this.pause();
        }
    }
}
export default Tetris;
