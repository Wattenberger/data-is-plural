<script>
  import { fly } from "svelte/transition";
  import { color as d3Color, hcl } from "d3";

  import ItemImages from "$components/ItemImages.svelte";
  import ItemBlobPhoto from "$components/ItemBlobPhoto.svelte";
  import colorPairs from "$components/colors";
  import { randomBetween } from "$components/utils";

  export let item = {};
  export let colors = [];
  export let onReroll = () => {};

  $: isDark = hcl(d3Color(colors[0])).l < 50;
  const getShiftedColor = str => {
    let color = d3Color(str);
    if (!color) return "#fff";
    const shift = 20;
    color.r = color.r + randomBetween(-shift, shift);
    color.g = color.g + randomBetween(-shift, shift);
    color.b = color.b + randomBetween(-shift, shift);
    return color.formatHex();
  };
  $: gradientColor2 = getShiftedColor(colors[0]);

  $: isLongHeadline =
    item &&
    (item.headline.length > 32 ||
      item.headline.split(" ").find(d => d.length > 10));
</script>

<div class="blobs">
  <ItemBlobPhoto str="{item.headline}" />
  <ItemBlobPhoto str="{item.headline}" />
  <ItemBlobPhoto str="{item.headline}" />
</div>
<div
  class="container"
  in:fly="{{ y: 60, duration: 600 }}"
  style="--background: {colors[0]}; --background-2: {gradientColor2}; --color: {colors[1]}">
  <main>
    {#if item}
      <div class="item" in:fly="{{ y: 30 }}">
        <h1 class:long="{isLongHeadline}">{item.headline}</h1>
        <p style="color: {isDark ? '#fff' : '#000'}">
          {@html item.text}
        </p>
      </div>
    {/if}
    <button class="reroll" on:click="{onReroll}">
      Re-roll [
      <strong>r</strong>
      ]
    </button>
    <ItemImages topics="{item.topics}" />
  </main>
</div>

<style lang="scss">
  .container {
    position: relative;
    min-height: 20vh;
    height: fit-content;
    max-width: 30em;
    margin-bottom: 6em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-out;
    padding: 5em 3em;
    color: var(--color);
    background: linear-gradient(var(--background), var(--background-2));
    z-index: 10;
  }
  .blobs {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: hidden;
    z-index: 5;
  }
  main {
    max-width: 40em;
    // margin: 0 auto;
  }

  h1 {
    // font-family: "Prata", serif;
    // font-family: "Playfair Display", serif;

    font-weight: 800;
    // font-style: italic;
    font-size: 5em;
    line-height: 0.9em;
    margin: 0 0 0.4em;
    letter-spacing: -0.03em;

    &.long {
      font-size: 3em;
      line-height: 1.1em;
    }
  }

  p {
  }
  :global(a) {
    color: inherit;
  }

  .reroll {
    font-family: "Inter", sans-serif;
    appearance: none;
    background: #fff;
    color: #333;
    position: absolute;
    bottom: -3em;
    left: 50%;
    outline: none;
    border: none;
    font-weight: 600;
    padding: 1em 2em;
    box-shadow: none;
    transform: translate(-50%, -50%);
    cursor: pointer;

    strong {
      font-weight: 900;
    }
  }

  @media (max-width: 600px) {
    .container {
      padding: 5em 2em;
      max-width: 100vw;
    }
    h1 {
      font-size: 3em;
      line-height: 1.1em;
    }
  }
</style>
