import { writable } from 'svelte/store';

export const grid = writable([
	Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => -1)),
]);
export const currentGrid = writable(0);

let numColors = 15;

export const colors = ['rgb(0, 0, 0)', 'rgb(255, 255, 255)'].concat(
	[...Array(numColors - 1)].map(
		(_, i) => `hsl(${(i * 360) / (numColors - 1)}, 100%, 50%)`
	)
);

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
