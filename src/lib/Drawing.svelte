<script>
    import {Base64} from '../util'
    import { Canvas, Layer, t } from 'svelte-canvas';
    import {colors, grid as gridStore, currentGrid as currentGridStore, primaryColor as primaryColorStore, secondaryColor as secondaryColorStore, tool as toolStore} from '../stores'

    const urlParams = new URLSearchParams(window.location.search);
    const loadedGrid = urlParams.has('grid') ? JSON.parse(atob(urlParams.get('grid'))) : [];

    let grid = [[]];
    let currentGrid = 0;
    let primaryColor = 0;
    let secondaryColor = 15;
    let tool = 'pencil';
    let lastX = -1;
    let lastY = -1;
    let gridBuffer = [[]];
    let shapeStartX = -1;
    let shapeStartY = -1;

    if (loadedGrid.length > 0) {
        if (loadedGrid[0][0].length < 15) {
            for (let i = 0; i < loadedGrid.length; i++) {
                for (let y = 0; y < loadedGrid[i].length; y++) {
                    for (let x = 0; x < loadedGrid[i][y].length; x++) {
                        let color = loadedGrid[i][y][x];
                        if (color <= 0) {
                            loadedGrid[i][y].splice(x + 1, 0, 0);
                            x += 1;
                            continue;
                        }
                        let color1 = color >> 4;
                        let color2 = color & 0xF;
                        loadedGrid[i][y][x] = color1;
                        loadedGrid[i][y].splice(x + 1, 0, color2);
                        x += 1;
                    }
                }
            }
        }
        gridStore.set(loadedGrid);
    }

    currentGridStore.subscribe(g => {
        currentGrid = g;
    })

    primaryColorStore.subscribe(color => {
        primaryColor = color;
    })

    secondaryColorStore.subscribe(color => {
        secondaryColor = color;
    })

    gridStore.subscribe(g => {
        grid = g;
        gridBuffer = g;
    })

    toolStore.subscribe(t => {
        tool = t;
    })

    $: render = ({ context, width, height }) => {
        for (let y = 0; y < gridBuffer[currentGrid].length; y++) {
            for (let x = 0; x < gridBuffer[currentGrid][0].length; x++) {
                let color = gridBuffer[currentGrid][y][x];
                if (color < 0) {
                    // render dithered pattern
                    if ((x % 2 == 0 && y % 2 == 0) || (x % 2 == 1 && y % 2 == 1)) {
                        context.fillStyle = 'white';
                    } else {
                        context.fillStyle = 'lightGray';
                    }
                    context.fillRect(x * 40, y * 40, 40, 40);
                } else {
                    // render color
                    context.fillStyle = colors[color];
                    context.fillRect(x * 40, y * 40, 40, 40);
                }
            }
        }
    };

    const handleClick = (e) => {
        let x = Math.floor(e.offsetX / 40);
        let y = Math.floor(e.offsetY / 40);
        // handle drawing
        gridStore.update(grid => {
            switch (tool) {
                case 'pencil':
                    grid[currentGrid][y][x] = e.shiftKey ? secondaryColor : primaryColor;
                    break;
                case 'eraser':
                    grid[currentGrid][y][x] = -1;
                    break;
                case 'fill':
                    let color = grid[currentGrid][y][x];
                    let newColor = e.shiftKey ? secondaryColor : primaryColor;
                    if (color == newColor) {
                        break;
                    }
                    let queue = [[x, y]];
                    while (queue.length > 0) {
                        let [x, y] = queue.shift();
                        if (grid[currentGrid][y][x] == color) {
                            grid[currentGrid][y][x] = newColor;
                            if (x > 0) {
                                queue.push([x - 1, y]);
                            }
                            if (x < grid[currentGrid][0].length - 1) {
                                queue.push([x + 1, y]);
                            }
                            if (y > 0) {
                                queue.push([x, y - 1]);
                            }
                            if (y < grid[currentGrid].length - 1) {
                                queue.push([x, y + 1]);
                            }
                        }
                    }
                    break;
                case 'eyedropper':
                    if (e.shiftKey) {
                        secondaryColorStore.set(grid[currentGrid][y][x]);
                    } else {
                        primaryColorStore.set(grid[currentGrid][y][x]);
                    }
                    break;
                default:
                    break;
            }
            return grid;
        })
    }

    const mouseMove = (e) => {
        let x = Math.floor(e.offsetX / 40);
        let y = Math.floor(e.offsetY / 40);

        // optimize a little bit so there aren't so many grid updates
        // every time the mouse moves
        if (x == lastX && y == lastY) {
            return;
        }
        lastX = x;
        lastY = y;

        if (e.buttons == 1) {
            switch (tool) {
                case 'pencil':
                    if (e.shiftKey) {
                        gridStore.update(grid => {
                            grid[currentGrid][y][x] = secondaryColor;
                            return grid;
                        })
                    } else {
                        gridStore.update(grid => {
                            grid[currentGrid][y][x] = primaryColor;
                            return grid;
                        })
                    }
                    break;
                case 'eraser':
                    gridStore.update(grid => {
                        grid[currentGrid][y][x] = -1;
                        return grid;
                    })
                    break;
                case 'line':
                    gridBuffer = grid.map(row => row.slice());
                    let dxLine = x - shapeStartX;
                    let dyLine = y - shapeStartY;
                    let steps = Math.max(Math.abs(dxLine), Math.abs(dyLine));
                    for (let i = 0; i <= steps; i++) {
                        let x = Math.round(shapeStartX + dxLine * i / steps);
                        let y = Math.round(shapeStartY + dyLine * i / steps);
                        gridBuffer[currentGrid][y][x] = e.shiftKey ? secondaryColor : primaryColor;
                    }

                    break;
                case 'rect':
                    gridBuffer = grid.map(row => row.slice());
                    let x1 = Math.min(x, shapeStartX);
                    let x2 = Math.max(x, shapeStartX);
                    let y1 = Math.min(y, shapeStartY);
                    let y2 = Math.max(y, shapeStartY);
                    for (let i = x1; i <= x2; i++) {
                        gridBuffer[currentGrid][y1][i] = e.shiftKey ? secondaryColor : primaryColor;
                        gridBuffer[currentGrid][y2][i] = e.shiftKey ? secondaryColor : primaryColor;
                    }
                    for (let i = y1; i <= y2; i++) {
                        gridBuffer[currentGrid][i][x1] = e.shiftKey ? secondaryColor : primaryColor;
                        gridBuffer[currentGrid][i][x2] = e.shiftKey ? secondaryColor : primaryColor;
                    }
                    break;
                case 'ellipse':
                    gridBuffer = grid.map(row => row.slice());
                    let cx = Math.floor((shapeStartX + x) / 2);
                    let cy = Math.floor((shapeStartY + y) / 2);
                    let rx = Math.floor(Math.abs(shapeStartX - x) / 2);
                    let ry = Math.floor(Math.abs(shapeStartY - y) / 2);
                    
                    let c = e.shiftKey ? secondaryColor : primaryColor;
                    for (let i = 0.1; i <= 2 * Math.PI; i += 0.1) {
                        let x = Math.floor(cx + rx * Math.cos(i));
                        let y = Math.floor(cy + ry * Math.sin(i));
                        gridBuffer[currentGrid][y][x] = c;
                    }
                    break;
            }
        }

        updateUrlParam();
    }

    const mouseDown = (e) => {
        let x = Math.floor(e.offsetX / 40);
        let y = Math.floor(e.offsetY / 40);

        switch (tool) {
            case 'line':
            case 'rect':
            case 'ellipse':
                shapeStartX = x;
                shapeStartY = y;
                break;

        }
    }

    const mouseUp = (e) => {
        let x = Math.floor(e.offsetX / 40);
        let y = Math.floor(e.offsetY / 40);
        switch (tool) {
            case 'line':
            case 'rect':
            case 'ellipse':
                gridStore.set(gridBuffer);
                break;
        }

        shapeStartX = -1;
        shapeStartY = -1;

        updateUrlParam();
    }

    const updateUrlParam = () => {
        urlParams.set('grid', btoa(JSON.stringify(grid)));
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }

    const eraseClicked = () => {
        gridStore.set(grid[currentGrid].map(row => row.map(() => -1)));
    }
</script>

<Canvas width={640} height={640} on:click={handleClick} on:mousemove={mouseMove} on:mousedown={mouseDown} on:mouseup={mouseUp}>
<Layer {render} />
</Canvas>