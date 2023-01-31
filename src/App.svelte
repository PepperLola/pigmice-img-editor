<script lang="ts">
	import ColorDisplay from "./lib/ColorDisplay.svelte";
import ColorPicker from "./lib/ColorPicker.svelte";
  import Drawing from "./lib/Drawing.svelte";
	import ToolPicker from "./lib/ToolPicker.svelte";
</script>



<main>
  <div id="mainView">
  <Drawing />
  <ColorPicker />
  <br/>
  <ToolPicker />
  </div>
  <ColorDisplay />
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    width: 100%;
    height: 100%;
  }
</style>