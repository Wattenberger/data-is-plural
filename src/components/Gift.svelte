<script>
  import * as d3 from "d3";

  import Box from "./Box.svelte";

  export let colors = ["#1C302F", "#F1B79F"];
  export let onSelect = () => {};

  let x = -76;
  let y = -66;
  let z = 25;

  const xScale = d3.scaleLinear([-200, 200], [-100, 0]).clamp(true);
  const yScale = d3.scaleLinear([-200, 200], [-100, 0]).clamp(true);
  const zScale = d3.scaleLinear([-200, 200], [-50, 50]).clamp(true);

  const onMouseMove = e => {
    const [mouseX, mouseY] = d3.pointer(e);
    x = xScale(mouseX);
    y = yScale(mouseY);
    // z = zScale(-mouseX - mouseY);
  };
</script>

<div class="wrapper">
  <button
    on:click="{onSelect}"
    class="gift"
    style=" --i: {y}; --j: {x}; --a: {z}deg;"
    on:mousemove="{onMouseMove}">
    <Box {colors} />
    <div class="top">
      <Box width="{9.3}" height="{2}" depth="{9.3}" {colors} />
    </div>
  </button>
</div>

<style lang="scss">
  :root {
    perspective: 45em;
  }

  .wrapper {
    position: relative;
    width: 19em;
    height: 9em;
  }

  .gift {
    appearance: none;
    border: none;
    box-shadow: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    transform: rotate3d(var(--i, -7), var(--j, 8), 0, var(--a, 45deg))
      var(--p, unquote(" "));
    cursor: pointer;
  }
  .top {
    position: absolute;
    transform: translate3d(-3em, -5.5em, 7em);
    z-index: 19;
  }
</style>
