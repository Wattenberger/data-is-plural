<script>
  import { onMount, onDestroy } from "svelte";
  import { spring } from "svelte/motion";
  import Zdog from "zdog";
  import * as d3 from "d3";

  import { randomBetween } from "./utils.js";

  import Box from "./Box.svelte";
  import Confetti from "./Confetti.svelte";

  export let colors = ["#1C302F", "#F1B79F"];
  export let onSelect = () => {};
  export let hasSelected = false;
  export let isHovered = false;
  export let isUnmounting = false;
  export let isSelected = false;

  let x = -76;
  // let y = -66;
  let z = 25;
  let xStart = 0;
  let yStart = 0;

  let hatY = spring(-40);
  let hatRotation = spring(0);
  let hatRotationY = spring(0);
  let boxScale = spring(1);
  let y = spring(100, {
    tension: randomBetween(0, 0.5),
    damping: randomBetween(0.3, 1)
  });

  const xScale = d3.scaleLinear([-200, 200], [-100, 0]).clamp(true);
  const yScale = d3.scaleLinear([-200, 200], [-100, 0]).clamp(true);
  const zScale = d3.scaleLinear([-200, 200], [-50, 50]).clamp(true);

  const onMouseMove = e => {
    const xDiff = e.clientX - xStart;
    const yDiff = e.clientY - yStart;
    xStart = e.clientX;
    yStart = e.clientY;
    illo.rotate.y += xDiff * 0.01;
    box.rotate.z += yDiff * 0.003;
  };

  const getBrighter = (color, diff = 1) => {
    const col = d3.hsl(color);
    col.l += diff;
    col.s += diff;
    return col.formatHex();
  };

  let canvasElement;
  let illo;
  let box;
  let hat;

  const getFaceColors = baseColor => ({
    rearFace: getBrighter(baseColor, 0),
    frontFace: getBrighter(baseColor, 0.02),
    leftFace: getBrighter(baseColor, 0.05),
    rightFace: getBrighter(baseColor, 0.1),
    topFace: getBrighter(baseColor, 0.15),
    bottomFace: getBrighter(baseColor, 0.1)
  });

  const drawRibbonTop = group => {
    const height = randomBetween(-50, -100);
    const x = randomBetween(10, 100);
    const z = randomBetween(10, 100);
    const corner = { x: x, y: height, z: z };
    const topCorner = { x: x * 0.5, y: height * 1, z: z * 0.5 };
    const bottomCorner = { x: x * 0.5, y: 30, z: z * 0.5 };
    const origin = { x: 0, y: 0, z: 0 };
    new Zdog.Shape({
      addTo: group,
      width: 60,
      height: 30,
      cornerRadius: 30,
      stroke: 10,
      translate: { y: -20 },
      rotate: {
        y: Math.PI * randomBetween(-1, 1)
      },
      color: getBrighter(ribbonColor, 0.2),
      path: [
        {
          bezier: [origin, topCorner, corner]
        },
        {
          bezier: [corner, bottomCorner, origin]
        }
      ]
    });
  };

  const baseColor = getBrighter(colors[0], -0.2);
  const ribbonColor = getBrighter(colors[1], -0.05);

  const addRibbon = (group, dms, color = ribbonColor, heightDiff = 1) => {
    const props = {
      addTo: group,
      color: ribbonColor,
      fill: ribbonColor,
      width: 20,
      stroke: 0
    };
    new Zdog.Rect({
      ...props,
      height: dms[1],
      translate: { x: -dms[0] / 2 - 2 },
      rotate: { y: Math.PI * 0.5 }
    });
    new Zdog.Rect({
      ...props,
      height: dms[1],
      translate: { x: dms[0] / 2 + 2 },
      rotate: { y: Math.PI * 0.5 }
    });
    new Zdog.Rect({
      ...props,
      height: dms[1],
      translate: { z: dms[2] / 2 + 2 }
    });
    new Zdog.Rect({
      ...props,
      height: dms[1],
      translate: { z: -dms[2] / 2 - 2 }
    });
    new Zdog.Rect({
      ...props,
      height: dms[0],
      rotate: { x: Math.PI * 0.5, z: Math.PI * 0.5 },
      translate: { y: (dms[1] / 2 + 1) * heightDiff }
    });
    new Zdog.Rect({
      ...props,
      height: dms[0],
      rotate: { x: Math.PI * 0.5, z: Math.PI * 0 },
      translate: { y: (dms[1] / 2 + 1) * heightDiff }
    });
  };
  const initIllo = () => {
    box = new Zdog.Box({
      width: 100,
      height: 90,
      depth: 100,
      translate: { y: 120 },
      rotate: {
        // y: Math.PI * randomBetween(-0.1, 0.1),
        z: Math.PI * randomBetween(-0.26, 0.26)
      },
      stroke: 20,
      ...getFaceColors(baseColor),
      topFace: false
    });
    const boxInside = new Zdog.Box({
      addTo: box,
      width: 100 - 21,
      height: 90 - 6,
      depth: 100 - 21,
      stroke: 0,
      backface: getBrighter(baseColor, -0.5),
      ...getFaceColors(getBrighter(baseColor, -0.5)),
      topFace: false
    });

    illo = new Zdog.Illustration({
      // set canvas with selector
      element: canvasElement,
      // dragRotate: box,
      background: "#FFF"
    });

    illo.addChild(box);

    addRibbon(box, [100, 110, 100]);
    hat = new Zdog.Box({
      addTo: box,
      width: 116,
      height: 30,
      depth: 116,
      translate: { y: $hatY },
      rotate: { z: Math.PI * 0.01 },
      stroke: 20,
      backface: getBrighter(baseColor, 0.11),
      ...getFaceColors(getBrighter(baseColor, 0.11)),
      bottomFace: false
    });
    const insideHat = new Zdog.Box({
      addTo: hat,
      width: 116 - 22,
      height: 30 - 6,
      depth: 116 - 22,
      stroke: 0,
      backface: getBrighter(baseColor, -0.11),
      ...getFaceColors(getBrighter(baseColor, -0.11)),
      bottomFace: false
    });
    addRibbon(hat, [120, 50, 120], getBrighter(ribbonColor, 0.11), -1);

    const ribbonTopGroup = new Zdog.Group({
      addTo: hat
    });
    drawRibbonTop(ribbonTopGroup);
    drawRibbonTop(ribbonTopGroup);
    drawRibbonTop(ribbonTopGroup);
    const shadow = new Zdog.Cylinder({
      diameter: 90,
      length: 2,
      addTo: illo,
      rotate: { x: Math.PI * 0.51 },
      translate: { y: 260 },
      color: "#dadada",
      stroke: false
    });
  };

  const updateIllo = () => {
    illo.updateRenderGraph();
  };

  let isMounted = false;
  const rotationSpeed = randomBetween(0.003, 0.03);
  function animate() {
    if (!isMounted) return;
    if (!isHovered || isUnmounting) illo.rotate.y += rotationSpeed;
    updateIllo();
    requestAnimationFrame(animate);
  }
  // start animation
  onMount(() => {
    isMounted = true;
    initIllo();
    y.set(0);
    animate();
  });
  onDestroy(() => {
    isMounted = false;
  });

  const updateHat = () => {
    if (isUnmounting) return;
    const y = isHovered ? -60 : -40;
    if (!hat) return;
    hatY.set(y);
  };
  $: {
    if (illo) illo.translate = { y: $y };
    if (hat) hat.translate = { y: $hatY };
    if (hat) hat.rotate = { z: $hatRotation, y: $hatRotationY };
    if (box) box.scale = $boxScale;
  }

  const doFade = () => {
    if (!hasSelected || isUnmounting) return;
    boxScale.set(0.3);
  };
  $: hasSelected, doFade();

  $: isHovered, updateHat();

  const onSelectLocal = () => {
    isUnmounting = true;
    boxScale.set(1.3);
    hatY.set(-310);
    hatRotation.set(Math.PI * 0.1);
    hatRotationY.set(Math.PI * 3);
    onSelect();
  };
</script>

<button
  class:faded="{hasSelected && !isUnmounting}"
  class:selected="{isUnmounting}"
  on:click="{onSelectLocal}"
  class="wrapper"
  on:mousemove="{onMouseMove}"
  on:mouseenter="{e => {
    xStart = e.clientX;
    yStart = e.clientY;
    isHovered = true;
  }}"
  on:focus="{() => {
    isHovered = true;
  }}"
  on:mouseleave="{() => {
    isHovered = false;
    animate();
  }}"
  on:blur="{() => {
    isHovered = false;
    animate();
  }}">
  <div class="gift">
    <canvas width="660" height="750" bind:this="{canvasElement}"></canvas>
    {#if isUnmounting}
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
      <Confetti illo="{box}" {colors} />
    {/if}
  </div>
</button>

<style lang="scss">
  .wrapper {
    position: relative;
    width: 19em;
    height: 45em;
    margin: 0px 0px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.8s ease-out;
  }
  .selected {
    z-index: 100;
  }
  button {
    appearance: none;
    background: none;
    border: none;
    box-shadow: none;
    cursor: pointer;

    &:focus,
    &:active {
      outline: none;
      background: rgba(155, 159, 161, 0.2);
    }
  }
  .faded {
    opacity: 0.1;
  }
  .gift {
    pointer-events: none;
  }

  @media (max-width: 600px) {
    .wrapper {
      width: 19em;
      height: 20em;
    }
    .wrapper:first-of-type {
      margin-top: 9em;
    }
  }
</style>
