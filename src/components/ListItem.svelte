<script>
  import { timeFormat } from "d3";

  export let headline = "";
  export let text = "";
  export let links = "";
  export let edition = "";
  export let date = "";
  export let hattips = "";

  $: splitLinks = links.split("\n");
  $: editionString = timeFormat("%b %Y")(date);

  const removeChrome = str =>
    str
      .replace(/^(http:\/\/www\.)/, "")
      .replace(/^(https:\/\/www\.)/, "")
      .replace(/^(www\.)/, "")
      .replace(/^(http:\/\/)/, "")
      .replace(/^(https:\/\/)/, "");
</script>

<div class="c">
  <div class="edition">{editionString}</div>
  <h3 class="headline">{headline}</h3>
  <p class="text">{text}</p>
  <div class="links">
    {#each splitLinks as link}
      <a href="{link}" class="link" title="{link}">
        <span class="base">{removeChrome(link).split('/')[0]}</span>
        <span class="full">{removeChrome(link)}</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .c {
    padding: 2em;
  }
  .headline {
    font-weight: 800;
  }
  .text {
    max-width: 60em;
  }
  .link {
    position: relative;
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .link .full {
    position: absolute;
    left: 0;
    opacity: 0;
  }
  .link:hover .base {
    opacity: 0;
  }
  .link:hover .full {
    opacity: 1;
  }
</style>
