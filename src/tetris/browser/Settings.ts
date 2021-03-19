import IColor from '../../core/IColor.js';

export const TETRIS_SETTINGS_DEFAULT: ITetrisGraphicsSettings = {
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
			{ r: 230, g:  30, b:  40 }, // RED -> Z
			{ r: 220, g: 110, b:  40 }, // ORANGE -> L
			{ r: 230, g: 210, b:  30 }, // YELLOW -> O
			{ r:  60, g: 180, b:  70 }, // GREEN -> S
			{ r:  70, g: 200, b: 230 }, // CYAN -> I
			{ r:  50, g: 120, b: 190 }, // BLUE -> J
			{ r: 130, g:  80, b: 160 }  // PURPLE -> T
		]
	}
};

export const TETRIS_SETTINGS_BW: ITetrisGraphicsSettings = {
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
}

export interface ITetrisGraphicsSettings {
	colors: ITetrisColorSettings;
	fontFamily: string;
	fontWeight: string;
	fontScale: number;
}

export interface ITetrisColorSettings {
	gameBack: string | string[];
	gameTextColor: string;
	wellBack: string | string[];
	wellTextColor: string;
	wellBorder: string;
	tetriminoBorder: string;
	tetrimino: IColor[];
}