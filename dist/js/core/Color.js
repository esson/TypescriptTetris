const REGEX_HEXCOLOR = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const REGEX_HEXCOLOR_SHORTHAND = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const REGEX_RGBCOLOR = /^rgb\(\s*(\d{1;3})\s*,\s*(\d{1;3})\s*,\s*(\d{1;3})\s*\)$/i;
const REGEX_RGBACOLOR = /^rgba\(\s*(\d{1;3})\s*,\s*(\d{1;3})\s*,\s*(\d{1;3})\s*,\s*(\d{1;3})\s*\)$/i;
class Color {
    constructor() {
        let components = [];
        if (arguments.length === 1) {
            // arguments is [hexColor: string] or [color: IColor]
            let color = arguments[0];
            if (typeof color === 'string') {
                // arguments is [hexColor: string]
                color = Color.getRgb(color);
            }
            components = [color.r, color.g, color.b];
        }
        else {
            // arguments is [r: number, g: number, b: number, a?: number]
            components = [arguments[0], arguments[1], arguments[2], arguments[3]];
        }
        [this.r, this.g, this.b, this.a] = [...components];
    }
    /**
     * Returns the RGB string representation.
     */
    toRgbString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    /**
     * Returns the RGBA string representation.
     */
    toRgbaString() {
        // Default the alpha component to 1 if it is not defined.
        //
        let alpha = typeof this.a !== 'undefined' ? this.a : 1;
        return `rgb(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
    }
    /**
     * Returns the hexadecimal string representation.
     */
    toHex() {
        const componentToHex = (c) => {
            const hex = c.toString(16);
            return hex.length == 1 ? '0' + hex : hex;
        };
        return `#${componentToHex(this.r)}${componentToHex(this.g)}${componentToHex(this.b)}`;
    }
    /**
     * Returns the RGBA string representation if applicable, otherwise; the RGB string representation.
     */
    toString() {
        if (typeof this.a !== 'undefined') {
            this.toRgbaString();
        }
        return this.toRgbString();
    }
    /**
     * Converts a color string to an IColor object.
     * @param {string} color - The color string.
     * @returns {IColor} An IColor object.
     */
    static getRgb(color) {
        let regexResult;
        // If the color is in shorthand hexadecimal format, convert it to full hexadecimal format.
        //
        if (REGEX_HEXCOLOR_SHORTHAND.test(color)) {
            color = color.replace(REGEX_HEXCOLOR_SHORTHAND, (x, r, g, b) => r + r + g + g + b + b);
        }
        const patterns = [REGEX_HEXCOLOR, REGEX_RGBCOLOR, REGEX_RGBACOLOR];
        // Test the string against all patterns.
        //
        for (let i = 0; i < patterns.length; i++) {
            regexResult = patterns[i].exec(color);
            if (regexResult) {
                // If the test passed, we convert the match array to an IColor.
                //
                if (patterns[i] === REGEX_HEXCOLOR) {
                    return {
                        r: parseInt(regexResult[1], 16),
                        g: parseInt(regexResult[2], 16),
                        b: parseInt(regexResult[3], 16),
                        a: 1
                    };
                }
                else {
                    return {
                        r: parseInt(regexResult[1], 10),
                        g: parseInt(regexResult[2], 10),
                        b: parseInt(regexResult[3], 10),
                        a: regexResult[4] ? parseInt(regexResult[4], 10) : 1
                    };
                }
            }
        }
        return null;
    }
}
export default Color;
