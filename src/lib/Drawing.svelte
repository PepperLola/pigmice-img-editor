<script>
    import { Canvas, Layer, t } from 'svelte-canvas';
    import {colors, grid as gridStore, primaryColor as primaryColorStore, secondaryColor as secondaryColorStore, tool as toolStore} from '../stores'

    let grid = [];
    let primaryColor = 0;
    let secondaryColor = 15;
    let tool = 'pencil';
    let lastX = -1;
    let lastY = -1;
    let gridBuffer = [];
    let shapeStartX = -1;
    let shapeStartY = -1;

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
        for (let y = 0; y < gridBuffer.length; y++) {
            for (let x = 0; x < gridBuffer[0].length; x++) {
                let color = gridBuffer[y][x];
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
                    grid[y][x] = e.shiftKey ? secondaryColor : primaryColor;
                    break;
                case 'eraser':
                    grid[y][x] = -1;
                    break;
                case 'fill':
                    let color = grid[y][x];
                    let newColor = e.shiftKey ? secondaryColor : primaryColor;
                    if (color == newColor) {
                        break;
                    }
                    let queue = [[x, y]];
                    while (queue.length > 0) {
                        let [x, y] = queue.shift();
                        if (grid[y][x] == color) {
                            grid[y][x] = newColor;
                            if (x > 0) {
                                queue.push([x - 1, y]);
                            }
                            if (x < grid[0].length - 1) {
                                queue.push([x + 1, y]);
                            }
                            if (y > 0) {
                                queue.push([x, y - 1]);
                            }
                            if (y < grid.length - 1) {
                                queue.push([x, y + 1]);
                            }
                        }
                    }
                    break;
                case 'eyedropper':
                    if (e.shiftKey) {
                        secondaryColorStore.set(grid[y][x]);
                    } else {
                        primaryColorStore.set(grid[y][x]);
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
                            grid[y][x] = secondaryColor;
                            return grid;
                        })
                    } else {
                        gridStore.update(grid => {
                            grid[y][x] = primaryColor;
                            return grid;
                        })
                    }
                    break;
                case 'eraser':
                    gridStore.update(grid => {
                        grid[y][x] = -1;
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
                        gridBuffer[y][x] = e.shiftKey ? secondaryColor : primaryColor;
                    }

                    break;
                case 'rect':
                    gridBuffer = grid.map(row => row.slice());
                    let x1 = Math.min(x, shapeStartX);
                    let x2 = Math.max(x, shapeStartX);
                    let y1 = Math.min(y, shapeStartY);
                    let y2 = Math.max(y, shapeStartY);
                    for (let i = x1; i <= x2; i++) {
                        gridBuffer[y1][i] = e.shiftKey ? secondaryColor : primaryColor;
                        gridBuffer[y2][i] = e.shiftKey ? secondaryColor : primaryColor;
                    }
                    for (let i = y1; i <= y2; i++) {
                        gridBuffer[i][x1] = e.shiftKey ? secondaryColor : primaryColor;
                        gridBuffer[i][x2] = e.shiftKey ? secondaryColor : primaryColor;
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
                        gridBuffer[y][x] = c;
                    }
                    break;
                // case 'ellipse':
                //     gridBuffer = grid.map(row => row.slice());
                //     let fill = false;
                //     let xb, yb, xc, yc = 0;
                //     yb = yc = (shapeStartY + y) / 2;
                //     let qb = (shapeStartY < y) ? (y - shapeStartY) : (shapeStartY - y);
                //     let qy = qb;
                //     let dy = qb / 2;
                //     if (qb % 2 != 0)
                //         yc ++;

                //     xb = xc = (shapeStartX + x) / 2;
                //     let qa = (shapeStartX < x) ? (x - shapeStartX) : (shapeStartX - x);
                //     let qx = qa % 2;
                //     let dx = 0;
                //     let qt = qa*qa+qb*qb-2*qa*qa*qb;
                //     if (qx != 0) {
                //         xc ++;
                //         qt += 3*qb*qb;
                //     }

                //     let c = e.shiftKey ? secondaryColor : primaryColor;
                //     while (qy >= 0 && qx <= qa) {
                //         console.log("IN WHILE")
                //         if (!fill) {
                //             gridBuffer[yb-dy][xb-dx] = c;
                //             if (dx != 0 || xb != xc) {
                //                 gridBuffer[yb-dy][xc+dx] = c;
                //                 if (dy != 0 || yb != yc)
                //                     gridBuffer[yc+dy][xc+dx] = c;
                //             }
                //             if (dy != 0 || yb != yc) {
                //                 gridBuffer[yc+dy][xb-dx] = c;
                //             }
                //         }
                //         if (qt + 2*qb*qb*qx + 3*qb*qb <= 0 ||
                //             qt + 2*qa*qa*qy - qa*qa <= 0) {
                //                 qt += 8*qb*qb + 4*qb*qb*qx;
                //                 dx ++;
                //                 qx += 2;
                //         } else if (qt - 2*qa*qa*qy + 3*qa*qa > 0) {
                //             if (fill) {
                //                 for (let i = xb-dx; i <= xc+dx; i++) {
                //                     gridBuffer[yc+dy][i] = c;
                //                 }
                //                 if (dy != 0 || yb != yc) {
                //                     for (let i = xb-dx; i <= xc+dx; i++) {
                //                         gridBuffer[yb-dy][i] = c;
                //                     }
                //                 }
                //             }
                //             qt += 8*qa*qa - 4*qa*qa*qy;
                //             dy --;
                //             qy -= 2;
                //         } else {
                //             if (fill) {
                //                 for (let i = xb-dx; i <= xc+dx; i++) {
                //                     gridBuffer[yc+dy][i] = c;
                //                 }
                //                 if (dy != 0 || yb != yc) {
                //                     for (let i = xb-dx; i <= xc+dx; i++) {
                //                         gridBuffer[yb-dy][i] = c;
                //                     }
                //                 }
                //             }
                //             qt += 8*qb*qb + 4*qb*qb*qx + 8*qa*qa - 4*qa*qa*qy;
                //             dx ++;
                //             qx += 2;
                //             dy --;
                //             qy -= 2;
                //         }
                //     }
                //     break;
            }
        }
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
    }
</script>

<Canvas width={640} height={640} on:click={handleClick} on:mousemove={mouseMove} on:mousedown={mouseDown} on:mouseup={mouseUp}>
<Layer {render} />
</Canvas>