import { ITetrisGraphicsSettings, TETRIS_SETTINGS_DEFAULT } from './Settings.js';
import Color from '../../core/Color.js';
import IAnimation from '../../core/IAnimation.js';
import Animation from '../../core/Animation.js';
import IColor from '../../core/IColor.js';
import IGraphics from '../../core/IGraphics.js';
import Tetrimino from '../Tetrimino.js';
import Tetris from '../Tetris.js';
import TetrisState from '../TetrisState.js';
import Vector from '../../core/Vector.js';

const TETRIS_CANVAS_TEXT_FLASH_DURATION = 4000;

class CanvasGraphics implements IGraphics {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private wellOffset: Vector;
    private wellSize: Vector;

    private asideOffset: Vector;
    private asideSize: Vector;

    private animationQueue: IAnimation[] = [];

    private lastTimestamp: number = 0;
    private timeStamp: number = 0;

    constructor(
        private tetris: Tetris,
        private settings: ITetrisGraphicsSettings = TETRIS_SETTINGS_DEFAULT,
        private scale: number = 20,
        canvas: HTMLCanvasElement = null
    ) {

        // Set the Aside Offset and Width.
        //
        var margin = scale;

        this.wellSize = new Vector(this.tetris.columns * scale, this.tetris.lines * scale);
        this.asideSize = new Vector(6 * scale, this.wellSize.y);

        this.wellOffset = new Vector(margin, margin);
        this.asideOffset = new Vector(this.wellOffset.x + this.wellSize.x + margin, margin);

        if (canvas) {
            this.canvas = canvas;
        } else {
            // Create and initialize the Canvas element.
            //
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.asideOffset.x + this.asideSize.x + margin;
            this.canvas.height = this.wellOffset.y + this.wellSize.y + margin;

            // Append the element to the body.
            //
            document.body.appendChild(this.canvas);
        }

        // Get the 2D drawing context.
        //
        this.context = this.canvas.getContext('2d');

        // Register subscriptions with Tetris to trigger animations.
        //
        this.tetris.subscribe('level', (event, level) => {
            this.animationQueue.push(new Animation(TETRIS_CANVAS_TEXT_FLASH_DURATION, (animationTimeElapsed) => this.drawTextFlash(animationTimeElapsed, `LEVEL ${level + 1}`)));
        });

        this.tetris.subscribe('highscore', (event, score) => {
            this.animationQueue.push(new Animation(TETRIS_CANVAS_TEXT_FLASH_DURATION, (animationTimeElapsed) => this.drawTextFlash(animationTimeElapsed, `A NEW HIGH!`)));
        });

        this.tetris.subscribe('perfectclear', (event, perfectClears) => {
            this.animationQueue.push(new Animation(TETRIS_CANVAS_TEXT_FLASH_DURATION, (animationTimeElapsed) => this.drawTextFlash(animationTimeElapsed, `PERFECT CLEAR!`)));
        });
        
    }

    public draw(timestamp: number) {

        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
        }

        const deltaTime = timestamp - this.lastTimestamp;

        this.lastTimestamp = timestamp;
        this.timeStamp += deltaTime;

        // Draw Components
        //

        this.context.save();

        this.drawBackground();

        this.drawWell();

        this.drawGhost();

        this.drawTetrimino();

        this.drawTextOverlay();

        this.drawPreview();

        this.drawScore();

        this.drawAnimations(timestamp);

        this.context.restore();

    }

    public drawTextFlash(animationTimeElapsed: number, text: string) {

        const duration = TETRIS_CANVAS_TEXT_FLASH_DURATION;
        const halfDuration = duration / 2;

        // Easing Functions that work with a time value between 0 and 1.
        //
        const easeOutQuad = (t: number) => t * (2 - t);
        const easeInOutQuad = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        // Use easing to animate the fontSize between 8 and 26.
        //
        const fontSize = 8 + 18 * easeOutQuad(animationTimeElapsed / duration);

        // Calculate the alpha to fade in and then out.
        //
        const alpha = animationTimeElapsed < halfDuration ? easeInOutQuad(animationTimeElapsed / halfDuration) : 1 - easeInOutQuad((animationTimeElapsed - halfDuration) / halfDuration);

        // Calculate the center position of the well.
        //
        const position = this.wellOffset.add(this.wellSize.divide(new Vector(2, 4)));

        this.context.globalAlpha = alpha;
        this.context.fillStyle = new Color(this.settings.colors.wellTextColor).toString();
        this.context.textAlign = 'center';
        this.context.font = `${fontSize * this.settings.fontScale}px ${this.settings.fontFamily}`;
        this.context.fillText(text, position.x, position.y);
        this.context.globalAlpha = 1;

    }

    private drawAnimations(time: number) {

        const currentAnimation = this.animationQueue[0];

        if (!currentAnimation) {
            return;
        }

        currentAnimation.draw(time);

        if (currentAnimation.isCompleted) {
            this.animationQueue.shift();
        }
    }

    private drawBackground() {

        this.context.fillStyle = this.getFillStyle(this.settings.colors.gameBack, this.canvas.height);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private drawWell() {

        let wellPosition = this.wellOffset,
            wellSize = new Vector(this.tetris.columns * this.scale, this.tetris.lines * this.scale),
            wellLineWidth = 2;

        // Draw the background.
        //
        this.context.fillStyle = this.getFillStyle(this.settings.colors.wellBack, wellSize.y);
        this.context.fillRect(wellPosition.x, wellPosition.y, wellSize.x, wellSize.y);

        // Draw the border.
        //
        this.context.lineWidth = wellLineWidth;
        this.context.strokeStyle = this.getFillStyle(this.settings.colors.wellBorder, wellSize.y);
        this.context.strokeRect(wellPosition.x - wellLineWidth, wellPosition.y - wellLineWidth, wellSize.x + wellLineWidth * 2, wellSize.y + wellLineWidth * 2);

        // Draw the occupied cells.
        //
        if (this.tetris.state !== TetrisState.Paused) {
            for (let y = 0; y < this.tetris.well.matrix.length; y++) {
                for (let x = 0; x < this.tetris.well.matrix[y].length; x++) {
                    if (this.tetris.well.matrix[y][x] !== 0) {
                        let position = new Vector(x, y).multiply(this.scale).add(this.wellOffset),
                            color = this.settings.colors.tetrimino[this.tetris.well.matrix[y][x]];

                        this.drawBlock(position, color);
                    }
                }
            }
        }
    }

    private drawTextOverlay() {

        // Draw the text.
        //
        if (this.tetris.state !== TetrisState.Gameplay) {

            const wellCenterPosition = this.wellOffset.add(this.wellSize.divide(2));
            const fontSize = this.scale * .8 * this.settings.fontScale;

            // Draw an overlay.
            //
            if (this.tetris.state === TetrisState.Ended) {

                this.context.globalAlpha = 0.5;
                this.context.fillStyle = this.getFillStyle(this.settings.colors.wellBack, this.wellSize.y);
                this.context.fillRect(this.wellOffset.x, this.wellOffset.y, this.wellSize.x, this.wellSize.y);
                this.context.globalAlpha = 1;
            }

            let textLines: string[] = [];

            if (this.tetris.state === TetrisState.Start) {

                textLines = [
                    '',
                    '',
                    '',
                    'HIT ENTER TO',
                    'START THE GAME',
                    '',
                    'MOVE:   ARROWS',
                    'DROP:    SPACE',
                    'PAUSE:   ENTER',
                    '',
                    'HIGHSCORE:',
                    this.formatNumber(this.tetris.highscore)
                ];
                
                // Draw the Title
                //
                const titleText = 'TETRIS',
                      titlePosition = wellCenterPosition.subtract(new Vector(0, this.scale * Math.floor(textLines.length / 2)));

                this.context.font = `${this.settings.fontWeight} ${2.5 * fontSize}px ${this.settings.fontFamily}`;
                this.context.fillStyle = this.getFillStyle(this.settings.colors.wellTextColor, fontSize);
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';

                this.context.fillText(titleText, titlePosition.x, titlePosition.y, this.wellSize.x);
            }

            if (this.tetris.state === TetrisState.Paused) {
                textLines = [
                    'HIT ENTER TO',
                    'CONTINUE GAME'
                ];
            }

            if (this.tetris.state === TetrisState.Ended) {
                textLines = [
                    'GAME OVER!'
                ];

            }

            if (textLines.length > 0) {
                this.context.font = `${this.settings.fontWeight} ${fontSize}px ${this.settings.fontFamily}`;
                this.context.fillStyle = this.getFillStyle(this.settings.colors.wellTextColor, fontSize);
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                
                const firstLinePosition = wellCenterPosition.subtract(new Vector(0, this.scale * Math.floor(textLines.length / 2)));

                for (let i = 0; i < textLines.length; i++) {
                    this.context.fillText(textLines[i], firstLinePosition.x, firstLinePosition.y + (i * this.scale), this.wellSize.x);
                }
            }
        }
    }

    private drawBlock(position: Vector, fill: IColor, stroke?: IColor) {

        this.context.fillStyle = new Color(fill).toString();
        this.context.fillRect(position.x, position.y, this.scale, this.scale);

        this.context.lineWidth = this.scale / 10;
        this.context.strokeStyle = stroke ? new Color(stroke).toString() : new Color(this.settings.colors.tetriminoBorder).toString();
        this.context.strokeRect(position.x, position.y, this.scale, this.scale);
    }

    private drawPreview() {

        const previewCount = 1,
              previewSize = new Vector(this.asideSize.x, this.asideSize.x * previewCount),
              previewPosition = new Vector(this.asideOffset.x, this.asideOffset.y);

        // Draw the Preview area.
        //
        this.context.fillStyle = this.getFillStyle(this.settings.colors.wellBack, previewSize.y);
        this.context.fillRect(previewPosition.x, previewPosition.y, previewSize.x, previewSize.y);

        this.context.lineWidth = 2;
        this.context.strokeStyle = this.settings.colors.wellBorder;
        this.context.strokeRect(previewPosition.x - 2, previewPosition.y - 2, previewSize.x + 4, previewSize.y + 4);

        // Copy the tetrimino and draw it centered in the Preview area.
        //
        if (this.tetris.state !== TetrisState.Paused && this.tetris.state !== TetrisState.Start) {
            for (let i = 0; i < previewCount; i++) {
                let tetrimino = new Tetrimino(this.tetris.player.queue[i].name).trim();

                let tetriminoSize = new Vector(tetrimino.getWidth() * this.scale, tetrimino.getHeight() * this.scale),
                    tetriminoPosition = previewPosition
                        
                        // Position the tetrimino in the center of the preview area.
                        .add(new Vector((previewSize.x - tetriminoSize.x), (previewSize.y / previewCount - tetriminoSize.y)).divide(2))
                        
                        // Add the relative height based on the number of previous tetriminos.
                        .add(0, previewSize.y / previewCount * i);

                this.drawTetrimino(tetrimino, tetriminoPosition);
            }
        }
    }

    private drawScore() {

        let size = new Vector(this.asideSize.x, 1 * this.scale),
            position = new Vector(this.asideOffset.x, this.asideOffset.y + 8 * this.scale).add(new Vector(size.x / 2, 0));

        this.context.font = `${size.y * 0.7 * this.settings.fontScale}px ${this.settings.fontFamily}`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = this.settings.colors.gameTextColor;

        const textLines = [
            'SCORE',
            this.formatNumber(this.tetris.player.score),
            '',
            'LEVEL',
            this.formatNumber(this.tetris.level + 1),
            '',
            'LINES',
            this.formatNumber(this.tetris.player.lines),
            '',
            '',
            '',
            '',
            '',
            '',
            'HIGHSCORE',
            this.formatNumber(this.tetris.highscore)
        ];

        const firstLinePosition = new Vector(position.x, position.y);

        for (let i = 0; i < textLines.length; i++) {
            this.context.fillText(textLines[i], firstLinePosition.x, firstLinePosition.y + (i * size.y), size.x);
        }
    }

    private drawTetrimino(tetrimino: Tetrimino = this.tetris.player.tetrimino, position: Vector = this.tetris.player.position.multiply(this.scale).add(this.wellOffset), fill?: IColor, stroke?: IColor) {
        if (this.tetris.state === TetrisState.Paused || this.tetris.state === TetrisState.Start) {
            return;
        }

        let t = tetrimino.matrix;

        for (let y = 0; y < t.length; y++) {
            for (let x = 0; x < t[y].length; x++) {
                if (t[y][x] !== 0) {
                    if (typeof fill === 'undefined') {
                        fill = this.settings.colors.tetrimino[t[y][x]];
                    }

                    this.drawBlock(position.add(new Vector(x, y).multiply(this.scale)), fill, stroke);
                }
            }
        }
    }

    private drawGhost() {

        if (this.tetris.state !== TetrisState.Gameplay) {
            return;
        }

        // Vector to add to the position to find the next collision.
        //
        const distance = new Vector(0, 0);
        const color: IColor = { r: 50, g: 50, b: 50 };
        const stroke: IColor = { r: 0, g: 0, b: 0 };

        // Find the position at where the tetrimino will collide.
        //
        while (!this.tetris.well.collide(this.tetris.player.tetrimino, this.tetris.player.position.add(distance))) {
            distance.y += 1;
        }

        if (distance.y > 1) {

            // Reset the position to where the tetrimino would merge.
            //
            distance.y += -1;

            // Draw the Ghost.
            //
            let ghostPosition = this.tetris.player.position.add(distance).multiply(this.scale).add(this.wellOffset);
            this.drawTetrimino(this.tetris.player.tetrimino, ghostPosition, color, stroke);
        }
    }

    private formatNumber(value: number): string {
        return value.toLocaleString();
    }

    private getFillStyle(color: string | IColor | (string | IColor)[], fillHeight: number) {

        if (color instanceof Array) {
            return this.getLinearGradientFillStyle(color, fillHeight);
        }

        const result = new Color(color);

        return result.toString();
    }

    private getLinearGradientFillStyle(color: (string | IColor)[], fillHeight: number) {

        let colors: Color[] = color.map(x => new Color(x));

        const step = 1 / (color.length - 1);
        const linearGradient = this.context.createLinearGradient(0, 0, 0, fillHeight);

        for (let i = 0; i < color.length; i++) {
            linearGradient.addColorStop(i * step, colors[i].toString());
        }

        return linearGradient;
    }
}

export default CanvasGraphics;