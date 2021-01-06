<script>
  import ItemImage from "$components/ItemImage.svelte";
  import randomFly from "$components/random-fly";
  import { topicsMap, topicToSlugMap, imageNames } from "$components/topics";
  import { pickFrom } from "./utils";

  export let topics = [];

  $: topics = topics.map(topic => topicToSlugMap[topic]).filter(d => d);
  $: existingImageNames = imageNames.filter(
    d => topics.includes(d) || topics.includes(`${d} 2`)
  );
  const numberOfImages = 9;
  $: images = new Array(numberOfImages)
    .fill(0)
    .map(_ => pickFrom(existingImageNames))
    .filter(d => d);
</script>

<div class="images">
  {#each images as image, i (image + i)}
    <ItemImage {image} />
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
    // overflow: hidden;
    z-index: 100;
  }
</style>
