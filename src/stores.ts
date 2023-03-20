import { writable } from 'svelte/store';

export const grid = writable([
	Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => -1)),
]);
export const currentGrid = writable(0);

let numColors = 15;

// export const colors = ['`rgb(0, 0, 0)`', '`rgb(255, 255, 255)`'].concat(
// 	[...Array(numColors - 1)].map(
// 		(_, i) => `hsl(${(i * 360) / (numColors - 1)}, 80%, 50%)`
// 	)
// );

export const colors = [
	`rgb(0, 0, 0)`,
	`rgb(255, 255, 255)`, // will show up as light gray on LED panel because white is too bright
	`rgb(255, 255, 0)`,
	`rgb(255, 165, 0)`,
	`rgb(255, 0, 0)`,
	`rgb(255, 0, 255)`,
	`rgb(128, 0, 128)`,
	`rgb(0, 0, 255)`,
	`rgb(0, 200, 255)`,
	`rgb(0, 230, 0)`,
	`rgb(34, 139, 34)`,
	`rgb(128, 0, 0)`,
	`rgb(210, 180, 140)`,
	`rgb(180, 180, 180)`,
	`rgb(128, 128, 128)`,
	`rgb(47, 79, 79)`,
];

export const primaryColor = writable(0);
export const secondaryColor = writable(1);

export const tool = writable<Tool>('pencil');

export type Tool =
	| 'pencil'
	| 'eraser'
	| 'fill'
	| 'line'
	| 'rect'
	| 'ellipse'
	| 'eyedropper';
