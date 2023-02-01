<script>
    import {grid as gridStore} from '../stores';

    let grid = [];

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

    const handleExport = (el) => {
        console.log('exporting')
        let name = prompt('Enter a name for the file');
        let text = `public static final int[][] ${name} = {\n`;
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (x == 0) {
                    text += '{';
                }
                text += grid[y][x] == -1 ? '0' : grid[y][x];
                if (x == grid[y].length - 1) {
                    text += '}';
                } else {
                    text += ', ';
                }
            }
            if (y == grid.length - 1) {
                text += '\n};';
            } else {
                text += ',\n';
            }
        }

        copyTextToClipboard(text);
    }
</script>

<div id="actionbar">
    <button on:click={handleExport}>Export</button>
</div>

<style>

</style>