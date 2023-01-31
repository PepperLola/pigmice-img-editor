<script>
    import FaPencilAlt from 'svelte-icons/fa/FaPencilAlt.svelte'
    import FaEraser from 'svelte-icons/fa/FaEraser.svelte'
    import FaFill from 'svelte-icons/fa/FaFill.svelte'
    import FaRegSquare from 'svelte-icons/fa/FaRegSquare.svelte'
    import FaRegCircle from 'svelte-icons/fa/FaRegCircle.svelte'
    import FaEyeDropper from 'svelte-icons/fa/FaEyeDropper.svelte'

    import {tool} from '../stores'

    const onload = (el) => {
        tool.subscribe(newTool => {
            // remove all active classes from tool picker children
            document.getElementById('toolPicker').querySelectorAll('.active').forEach(element => {
                element.classList.remove('active')
            })

            document.getElementById(newTool).classList.add('active')
        })
    }

    const handleToolClick = (event) => {
        let e = event.target;
        // handle clicking on icon
        while (e.tagName !== 'BUTTON') {
            e = e.parentElement;
        }
        tool.set(e.id)
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
</style>