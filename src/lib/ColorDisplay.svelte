<script>
    import {primaryColor, secondaryColor, colors} from '../stores'
    import FaArrowsAltH from 'svelte-icons/fa/FaArrowsAltH.svelte'

    let primaryColorBackup = 0;
    let secondaryColorBackup = 0;

    window.onload = () => {

        primaryColor.subscribe(color => {
            primaryColorBackup = color;
            document.getElementById('primaryColor').style.backgroundColor = colors[color];
        })

        secondaryColor.subscribe(color => {
            secondaryColorBackup = color;
            document.getElementById('secondaryColor').style.backgroundColor = colors[color];
        })
    }


    const handleSwitchClick = () => {
        let temp = primaryColorBackup;
        primaryColor.set(secondaryColorBackup);
        secondaryColor.set(temp);
    }
</script>

<div id="container">
    <div id="secondaryColor"></div>
    <div id="primaryColor"></div>
    <div id="switchArrow" on:click={handleSwitchClick}><FaArrowsAltH /></div>
</div>

<style>
    :root {
        --square-width: 64px;
    }
    #container {
        position: relative;
        width: calc(var(--square-width) * 1.5);
        height: calc(var(--square-width) * 1.5);
    }
    #primaryColor {
        position: absolute;
        left: 0;
        top: 0;
        width: var(--square-width);
        height: var(--square-width);
        background: red;
    }

    #secondaryColor {
        position: absolute;
        left: calc(var(--square-width)/2);
        top: calc(var(--square-width)/2);
        width: var(--square-width);
        height: var(--square-width);
        background: blue;
    }
    #switchArrow {
        position: absolute;
        left: 16px;
        bottom: 0px;
        transform: translate(-50%, 0);
        width: 16px;
        cursor: pointer;
    }
</style>