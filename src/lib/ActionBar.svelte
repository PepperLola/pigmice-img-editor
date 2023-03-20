<script>
    import {grid as gridStore} from '../stores';

    let grid = [[]];

    gridStore.subscribe(g => {
        grid = g;
    });

    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }
    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    const exportImage = (name) => {
        return `public static final Image ${name} = ${exportImageInstance()};`;   
    }

    const exportImageInstance = (i = 0) => {
        let text = `new Image(new byte[][] {\n`;
        
        for (let y = 0; y < grid[i].length; y++) {
            for (let x = 0; x < grid[i][y].length; x += 2) {
                if (x == 0) {
                    text += '{';
                }
                let color1 = Math.max(0, grid[i][y][x]);
                let color2 = Math.max(0, grid[i][y][x + 1]);

                if (color1 == 0 && color2 == 0) {
                    text += "0";
                } else {
                    text += "(byte)" + ((color1 << 4) | color2).toString();
                }
                if (x >= grid[i][y].length - 2) {
                    text += '}';
                } else {
                    text += ', ';
                }
            }
            
            if (y == grid[i].length - 1) {
                text += '\n})';
            } else {
                text += ',\n';
            }
        }

        return text;
    }

    const exportAnimation = (name) => {
        let text = `public static final Animation ${name} = new Animation(Arrays.asList(\n`;

        for (let i = 0; i < grid.length; i++) {
            text += exportImageInstance(i);
        }

        text += "));";
        
        return text;
    }

    const handleExport = (el) => {
        let name = prompt(`Enter a name for the ${grid.length > 1 ? 'animation' : 'image'}:`).replaceAll(' ', '_').toUpperCase();

        if (grid.length > 1)
            copyTextToClipboard(exportAnimation(name));
        else
            copyTextToClipboard(exportImage(name));
    }
</script>

<div id="actionbar">
    <button on:click={handleExport}>Export</button>
</div>

<style>

</style>
