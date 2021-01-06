<script>
  import { onMount } from "svelte";

  import { generator } from "$components/blob-generator";
  import randomFly from "$components/random-fly.js";
  import { randomBetween, getUniqueId } from "$components/utils";

  export let str = "";
  export let i = 0;

  let id = 0;
  onMount(() => {
    id = getUniqueId();
  });

  // const photoUrl = "https://source.unsplash.com/featured"
  const photoUrl = "https://source.unsplash.com/600x600";

  let x = 0;
  let y = 0;
  let scale = 1;
  let hasImage = true;
  let blob = "";
  $: {
    const _ = str.slice(0, 0);
    x =
      Math.random() < 0.5 ? randomBetween(-390, -100) : randomBetween(100, 390);
    y =
      Math.random() < 0.5 ? randomBetween(-350, -100) : randomBetween(100, 350);
    scale = randomBetween(0.9, 3);
    blob = generator().path;
    hasImage = Math.random() < 0.4;
  }
</script>

<div
  class="wrapper"
  style="transform: translate({x}px, {y}px)"
  in:randomFly="{{ x, y, duration: 1600, delay: randomBetween(0, 3) }}">
  <div
    class="photo"
    style="clip-path: url(#blob-clip-path-{id}); transform: translate(-50%,
    -50%) scale({scale})">
    <div
      class="image"
      class:no-image="{!hasImage}"
      style="background-image: url({photoUrl}/?{str.replace(/ /g, ',')})">
      <svg viewBox="0 0 1 1" preserveAspectRatio="none">
        <defs>
          <clipPath id="blob-clip-path-{id}" clipPathUnits="objectBoundingBox">
            <path d="{blob}"></path>
          </clipPath>
        </defs>
      </svg>
      <!-- <img src="{photoUrl}/?{str.replace(/ /g, ',')}" /> -->
    </div>
  </div>
</div>

<style lang="scss">
  .wrapper {
    position: absolute;
    top: 36%;
    left: 50%;
    transition: all 0.9s ease-out;
  }
  .no-image {
    background: var(--color) !important;
  }
  .photo {
    position: absolute;
    width: 15em;
    height: 15em;
    transition: all 0.9s ease-out;

    img {
      width: 100%;
    }
    .image {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center center;
    }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(var(--background), var(--background-2));
      z-index: 20;
      mix-blend-mode: hard-light;
      opacity: 0.5;
    }
    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      background: linear-gradient(var(--background), var(--background-2));
      z-index: 10;
      mix-blend-mode: screen;
      opacity: 0.5;
    }
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  path {
    transition: all 0.9s ease-out;
  }
</style>
