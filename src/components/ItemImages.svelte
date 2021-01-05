<script>
  import ItemImage from "$components/ItemImage.svelte";
  import randomFly from "$components/random-fly.js";
  import { topicsMap, topicToSlugMap } from "$components/topics.js";

  export let topics = [];

  $: images = topics.map(topic => topicToSlugMap[topic]).filter(d => d);
</script>

<div class="images">
  {#each images as image, i (image + i)}
    <ItemImage {image} />
    <ItemImage {image} />
    <ItemImage image="{image} 2" />
    <ItemImage image="{image} 2" />
  {/each}
</div>

<style lang="scss">
  .images {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 100;
  }
</style>
