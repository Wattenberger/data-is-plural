<script>
  export let items = [];
  export let component;

  const pageLength = 30;
  let pageIndex = 0;

  $: {
    items;
    pageIndex = 0;
  }

  $: start = pageIndex * pageLength;
  $: end = start + pageLength;

  const onDiffPageIndex = diff => {
    pageIndex += diff;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
</script>

<div class="list">
  {#each items.slice(start, end) as item}
    <svelte:component this="{component}" {...item} />
  {/each}
</div>

{#if items.length > end}
  <button style="margin: 2em" on:click="{() => onDiffPageIndex(1)}">
    Older
  </button>
{/if}
