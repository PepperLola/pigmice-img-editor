<script>
    import { Canvas, Layer, t } from 'svelte-canvas';
    import {colors, grid as gridStore, currentGrid as currentGridStore} from '../stores'

    let grid = [[]];
    let gridBuffer = [[]];
    let currentGrid = 0;

    gridStore.subscribe(g => {
        grid = g;
        gridBuffer = g;
    })

    currentGridStore.subscribe(g => {
        currentGrid = g;
    })

    const addFrame = () => {
        grid.push(Array.from({length: 16}, () => Array.from({length: 16}, () => -1)));
        gridStore.set(grid);
        currentGrid = grid.length - 1;
        currentGridStore.set(currentGrid);
    }

    const handleClick = (el) => {
        let frame = parseInt(el.target.classList[0].split('-')[1]);
        currentGrid = frame;
        currentGridStore.set(frame);
    }

    const handleKeypress = (event) => {
        console.log(event);
        switch (event.key) {
            case "d":
                let g = grid[currentGrid];
                gridStore.set(
                    grid.slice(0, currentGrid + 1).concat([structuredClone(g)]).concat(gridBuffer.slice(currentGrid + 1))
                );
                currentGridStore.set(currentGrid + 1);
                break;
            case "Backspace":
            case "Delete":
                if (confirm("Are you sure you want to delete?")) {
                    if (grid.length > 1) {
                        grid.splice(currentGrid, 1);
                        gridStore.set(grid);
                        currentGridStore.set(currentGrid - 1);
                    }
                }
                break;
            case "ArrowLeft":
                if (currentGrid > 0) {
                    currentGridStore.set(currentGrid - 1);
                }
                break;
            case "ArrowRight":
                if (currentGrid < grid.length - 1) {
                    currentGridStore.set(currentGrid + 1);
                }
                break;
        }
    }

    $: render = ({ context, width, height }) => {
        let currentFrame = parseInt(context.canvas.classList[0].split('-')[1]);
        for (let y = 0; y < gridBuffer[currentFrame].length; y++) {
            for (let x = 0; x < gridBuffer[currentFrame][0].length; x++) {
                let color = gridBuffer[currentFrame][y][x];
                if (color < 0) {
                    // render dithered pattern
                    if ((x % 2 == 0 && y % 2 == 0) || (x % 2 == 1 && y % 2 == 1)) {
                        context.fillStyle = 'white';
                    } else {
                        context.fillStyle = 'lightGray';
                    }
                    context.fillRect(x * 4, y * 4, 4, 4);
                } else {
                    // render color
                    context.fillStyle = colors[color];
                    context.fillRect(x * 4, y * 4, 4, 4);
                }
            }
        }
    };
</script>

<main>
    <div id="wrapper">
        {#each grid as frame, i}
            <div class={"frameWrapper" + (i == currentGrid ? " selected" : "")}>
                <Canvas class={"frame-" + i} width={64} height={64} on:click={handleClick}>
                    <Layer {render} />
                </Canvas>
            </div>
        {/each}
        <button on:click={addFrame}>+</button>
    </div>
</main>

<svelte:window on:keydown={handleKeypress} />

<style>
    #wrapper {
        display: flex;
        flex-direction: row;
        gap: 12px;
    }

    .frameWrapper:not(.selected) {
        padding: 3px;
    }

    .selected {
        border-radius: 2px;
        border: 3px solid -webkit-focus-ring-color;
        border: 3px solid Highlight;
    }
</style>