class CanvasHelper {
    
    context: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
    }

    private getRandomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);

        return "rgb(" + r + "," + g + "," + b + ")";
    }

    public fillTextColor(text: string, x: number, y: number, colors?: string[], maxWidth?: number) {

        const textAlign = this.context.textAlign;
        const charWidths = new Array<number>(text.length);

        for (let i = 0; i < text.length; i++) {
            charWidths[i] = this.context.measureText(text[i]).width;
        }

        if (textAlign === 'center' || textAlign === 'right') {
            
            const textWidth = charWidths.reduce((x, y) => x + y, 0);

            // Adjust the x position to the left of the text.
            //
            if (textAlign === 'center') {
                x = x - textWidth / 2;
            }
            if (textAlign === 'right') {
                x = x - textWidth;
            }

            // Set the textAlign of the context to 'left', so that 
            // the text will be drawn starting from the x position.
            //
            this.context.textAlign = 'left';
        }

        let colorIndex = 0;

        for (var i = 0; i <= text.length; ++i) {
            
            if (colorIndex >= colors.length) {
                colorIndex = 0;
            }

            const char = text.charAt(i);

            this.context.fillStyle = colors[colorIndex++] || this.context.fillStyle;
            this.context.fillText(char, x, y, maxWidth);
            
            colorIndex = colorIndex + 1 >= colors.length ? 0 : colorIndex + 1;
            x += charWidths[i];
        }

        // Reset the textAlign property.
        //
        this.context.textAlign = textAlign;
    }

    public getTextWidth(text: string) {

        // Calculate the width for each character.
        //
        const charWidths = [];

        for (let i = 0; i < text.length; i++) {
            charWidths.push(this.context.measureText(text.charAt(i)).width);
        }

        // Calculate and return the sum om all characters width.
        //
        const textWidth = charWidths.reduce((x, y) => x + y, 0);

        return textWidth;

    }
}

export default CanvasHelper;