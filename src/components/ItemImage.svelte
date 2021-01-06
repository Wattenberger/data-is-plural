<script>
  import randomFly from "$components/random-fly.js";
  import { pickFrom, randomBetween } from "$components/utils";

  export let image = "";

  const sides = ["left", "bottom", "right"];

  $: side = pickFrom(sides);

  const width = 360;
  const yMin = -130;
  const yMax = 160;

  $: x =
    (side == "left"
      ? -width
      : side == "right"
      ? width
      : randomBetween(-width, width)) + randomBetween(-100, 100);
  $: xRotation = randomBetween(-30, 30);
  $: y =
    (side == "bottom" ? yMax : randomBetween(yMin, yMax)) +
    randomBetween(-100, 100);
  $: rotation = randomBetween(-90, 90);
  $: scale = randomBetween(0.3, 1);
  $: opacity = randomBetween(0.3, 1);
</script>

<div
  class="image-outer"
  style="transform: scale({scale}) translateX({x}px); --transform-origin: calc({xRotation})
  calc({y} - 5em)">
  <div
    class="image-container"
    in:randomFly="{{ x: xRotation, y, rotation, scale, opacity }}"
    style="transform: translate({xRotation}px, {y}px) rotate({rotation}deg);
    opacity: {opacity}">
    <div
      class="image-wrapper"
      style="-webkit-mask-image: url('/dataset-images/{image}.png'); mask-image:
      url('/dataset-images/{image}.png');">
      <div
        class="image"
        style="background-image: url('/dataset-images/{image}.png')"></div>
    </div>
  </div>
</div>

<style lang="scss">
  .image-outer {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
  }
  .image-container {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    transform-origin: var(--transform-origin);
  }
  .image-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 10em;
    height: 10em;
    -webkit-mask-mode: alpha;
    mask-mode: alpha;
    -webkit-mask-size: contain;
    mask-size: contain;
    transform: translate(-50%, -50%);
  }
  .image {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: contain;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: var(--background);
      background: var(--color);
      z-index: 0;
    }
  }
</style>
