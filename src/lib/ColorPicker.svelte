<script>
    import { Canvas, Layer, t } from 'svelte-canvas';

    import {colors, primaryColor, secondaryColor} from '../stores'

    $: render = ({ context, width, height }) => {
        for (let i = 0; i < colors.length; i++) {
            context.fillStyle = colors[i];
            context.fillRect(i * 40, 0, 40, 20);
        }
    };

    const handleClick = (e) => {
        let colorIdx = Math.floor(e.offsetX / 40);
        if (e.shiftKey) {
            secondaryColor.set(colorIdx);
        } else {
            primaryColor.set(colorIdx);
        }
    }
</script>

<Canvas width={640} height={20} on:click={handleClick}>
<Layer {render} />
</Canvas>