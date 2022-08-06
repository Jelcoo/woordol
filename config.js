export const keyboardRows = [
	['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
	['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
	['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
];

export const allKeys = keyboardRows.flat();

export const wordLength = 5;

export const newGame = {
	0: Array.from({ length: wordLength }).fill(''),
	1: Array.from({ length: wordLength }).fill(''),
	2: Array.from({ length: wordLength }).fill(''),
	3: Array.from({ length: wordLength }).fill(''),
	4: Array.from({ length: wordLength }).fill(''),
	5: Array.from({ length: wordLength }).fill(''),
};
