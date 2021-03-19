import Tetris from './tetris/Tetris.js';
import { AudioController } from './tetris/browser/AudioController.js';
import CanvasGraphics from './tetris/browser/CanvasGraphics.js';
import BrowserGame from './core/BrowserGame.js';
import { TETRIS_SETTINGS_BW } from './tetris/browser/Settings.js';

var tetris = new Tetris(10, 24);
var canvasGraphics = new CanvasGraphics(tetris, TETRIS_SETTINGS_BW, 20);

var audioController = new AudioController(tetris);
var game = new BrowserGame(tetris, canvasGraphics);