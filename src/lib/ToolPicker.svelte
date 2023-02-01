<script>
    import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
    import FaEraser from 'svelte-icons/fa/FaEraser.svelte'
    import FaFill from 'svelte-icons/fa/FaFill.svelte'
    import FaRegSquare from 'svelte-icons/fa/FaRegSquare.svelte'
    import FaRegCircle from 'svelte-icons/fa/FaRegCircle.svelte'
    import FaEyeDropper from 'svelte-icons/fa/FaEyeDropper.svelte'
    import FaRegTrashAlt from 'svelte-icons/fa/FaRegTrashAlt.svelte'

    import {grid, tool} from '../stores'
    let clearPressed = false;
    const CLEAR_TIMEOUT = 1000;
    let timeout = null;

    const onload = (el) => {
        tool.subscribe(newTool => {
            // remove all active classes from tool picker children
            document.getElementById('toolPicker').querySelectorAll('.active').forEach(element => {
                element.classList.remove('active')
            })

            document.getElementById(newTool).classList.add('active')
        })

        const clearButton = document.getElementById('clear');

        clearButton.onmousedown = () => {
            clearPressed = true;
            timeout = setTimeout(() => {
                if (clearPressed) {
                    handleClear();
                    clearPressed = false;
                }
            }, CLEAR_TIMEOUT);
        }

        clearButton.onmouseup = () => {
            clearPressed = false;
            clearTimeout(timeout);
        }
    }

    const handleToolClick = (event) => {
        let e = event.target;
        // handle clicking on icon
        while (e.tagName !== 'BUTTON') {
            e = e.parentElement;
        }
        tool.set(e.id)
    }

    const handleClear = (_) => {
        // clear grid
        grid.set(Array.from({ length: 16 }, () => Array.from({ length: 16 }, () => -1)))
    }

</script>

<div id="toolPicker" use:onload>
    <button id="pencil" class="toolButton active" on:click={handleToolClick}><div class="buttonIcon"><FaPencilAlt /></div></button>
    <button id="eraser" class="toolButton" on:click={handleToolClick}><div class="buttonIcon"><FaEraser /></div></button>
    <button id="fill" class="toolButton" on:click={handleToolClick}><div class="buttonIcon"><FaFill /></div></button>
    <button id="line" class="toolButton" on:click={handleToolClick}>Line</button>
    <button id="rect" class="toolButton" on:click={handleToolClick}><div class="buttonIcon"><FaRegSquare /></div></button>
    <button id="ellipse" class="toolButton" on:click={handleToolClick}><div class="buttonIcon"><FaRegCircle /></div></button>
    <button id="eyedropper" class="toolButton" on:click={handleToolClick}><div class="buttonIcon"><FaEyeDropper /></div></button>
    <button id="clear" class="toolButton"><div class="buttonIcon"><FaRegTrashAlt /></div></button>
</div>

<style>
    #toolPicker {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .toolButton {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button.active:not(:hover) {
        outline: 1px solid #4169E1;
    }

    .toolButton * {
        width: 16px;
    }

    #clear {
        position: relative;
        cursor: pointer;
    }

    #clear:active {
        cursor: wait;
    }

    #clear:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        scale: 115%;
        border-radius: 8px;
        background: transparent;
    }

    #clear:active:before {
        animation: rotateClearBackground 1s linear;
    }

    @keyframes rotateClearBackground {
        0% {
            background: transparent;
        }
        10% {
            background: conic-gradient(red 0deg,  red calc(36deg*1), transparent calc(36deg*1));
        }
        20% {
            background: conic-gradient(red 0deg,  red calc(36deg*2), transparent calc(36deg*2));
        }
        30% {
            background: conic-gradient(red 0deg,  red calc(36deg*3), transparent calc(36deg*3));
        }
        40% {
            background: conic-gradient(red 0deg,  red calc(36deg*4), transparent calc(36deg*4));
        }
        50% {
            background: conic-gradient(red 0deg,  red calc(36deg*5), transparent calc(36deg*5));
        }
        60% {
            background: conic-gradient(red 0deg,  red calc(36deg*6), transparent calc(36deg*6));
        }
        70% {
            background: conic-gradient(red 0deg,  red calc(36deg*7), transparent calc(36deg*7));
        }
        80% {
            background: conic-gradient(red 0deg,  red calc(36deg*8), transparent calc(36deg*8));
        }
        90% {
            background: conic-gradient(red 0deg,  red calc(36deg*9), transparent calc(36deg*9));
        }
        100% {
            background: conic-gradient(red 0deg,  red 359deg, transparent 360deg);
        }
    }
</style>