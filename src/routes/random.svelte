<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { color as d3Color, hcl } from "d3";

  import GrabData from "$components/GrabData.svelte";
  import Footer from "$components/Footer.svelte";
  import Gift from "$components/GiftZdog.svelte";
  import ItemImages from "$components/ItemImages.svelte";
  import ItemBlobPhoto from "$components/ItemBlobPhoto.svelte";
  import DataBox from "$components/DataBox.svelte";
  import colorPairs from "$components/colors";
  import { data, getId, pickFrom, randomBetween } from "$components/utils";

  let isRolling = true;
  let hasSelected = false;
  let options = [];

  let item;
  let colors = [];

  const onGetOptions = () => {
    options = [
      { item: pickFrom(data), colors: grabColor() },
      { item: pickFrom(data), colors: grabColor() },
      { item: pickFrom(data), colors: grabColor() }
    ];
  };

  $: {
    let _ = data;
    onGetOptions();
  }

  const grabColor = () => {
    let colors = pickFrom(colorPairs);
    if (Math.random() < 0.5) colors = [...colors.reverse()];
    if (Math.abs(hcl(d3Color(colors[0])).l - 50) < 26) colors = grabColor();
    return colors;
  };

  const onSelectItem = (newItem, newColors) => {
    hasSelected = true;
    setTimeout(() => {
      item = newItem;
      colors = newColors;
      isRolling = false;
      const id = getId(item);
      history.pushState(null, null, `#${id}`);
    }, 1000);
  };

  const onReroll = () => {
    isRolling = true;
    hasSelected = false;
    onGetOptions();
    history.pushState(null, null, "#");
  };

  onMount(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const dataset = data.find(d => d.id == id);
    if (!dataset || !dataset.edition) return;
    onSelectItem(dataset, grabColor());
  });
</script>

<!-- <svelte:window
  on:keydown="{e => {
    if (e.key != 'r') return;
    onReroll();
  }}" /> -->

<!-- <GrabData bind:data /> -->

<div class="wrapper">
  {#if isRolling}
    <div class="title">
      <h1>Choose your dataset</h1>
    </div>
    {#each options as { item, colors }}
      <Gift
        {colors}
        onSelect="{() => onSelectItem(item, colors)}"
        {hasSelected} />
    {/each}
  {:else}
    <DataBox {item} {colors} {onReroll} />
  {/if}

  <h3>
    Or
    <a href="/">see the full list</a>
  </h3>
</div>

<Footer />

<style lang="scss">
  @import url("https://rsms.me/inter/inter.css");
  @import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,800;0,900;1,800&display=swap");

  :root {
    font-family: "Inter", sans-serif;

    font-size: 1.1em;
    line-height: 1.6em;
    color: #1d1d1d;
    // background: #b2abab;
  }

  .wrapper {
    min-height: 98vh;
    padding: 5em;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  main {
    max-width: 40em;
    // margin: 0 auto;
  }

  h1 {
    // font-family: "Prata", serif;
    // font-family: "Playfair Display", serif;

    font-weight: 900;
    // font-style: italic;
    font-size: 5em;
    line-height: 0.96em;
    margin: 0 0 0.3em;
    letter-spacing: -0.03em;
  }

  h3 {
    font-weight: 500;
    display: block;
    z-index: 100;
    position: absolute;
    bottom: 9em;
  }
  h3 a {
    font-style: italic;
    pointer-events: all;
  }

  .title {
    position: absolute;
    top: 21vh;
    max-width: 40em;
    text-align: center;
    z-index: 10;
    pointer-events: none;
  }

  :global(a) {
    color: inherit;
  }

  @media (max-width: 700px) {
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 3em 1em;
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 3em;
      line-height: 1em;
    }
  }
</style>
