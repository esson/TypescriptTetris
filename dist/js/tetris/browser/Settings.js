export const TETRIS_SETTINGS_DEFAULT = {
    fontFamily: '"Press Start 2P"',
    fontWeight: 'normal',
    fontScale: 0.7,
    colors: {
        gameBack: '#fff',
        gameTextColor: '#000',
        wellBack: ['#0f4664', '#6ebef0'],
        wellTextColor: '#000',
        wellBorder: '#d45147',
        tetriminoBorder: '#000000',
        tetrimino: [
            null,
            { r: 230, g: 30, b: 40 },
            { r: 220, g: 110, b: 40 },
            { r: 230, g: 210, b: 30 },
            { r: 60, g: 180, b: 70 },
            { r: 70, g: 200, b: 230 },
            { r: 50, g: 120, b: 190 },
            { r: 130, g: 80, b: 160 } // PURPLE -> T
        ]
    }
};
export const TETRIS_SETTINGS_BW = {
    fontFamily: '"Press Start 2P"',
    fontWeight: 'normal',
    fontScale: 0.7,
    colors: {
        gameBack: '#000',
        gameTextColor: '#FFF',
        wellBack: '#000',
        wellTextColor: '#FFF',
        wellBorder: '#FFF',
        tetriminoBorder: '#000',
        tetrimino: TETRIS_SETTINGS_DEFAULT.colors.tetrimino.map(x => x == null ? x : { r: x.r, g: x.g, b: x.b })
    }
};
