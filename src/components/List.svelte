<script>
  import VirtualList from "./VirtualList.svelte";
  import ListItem from "./ListItem.svelte";
  import { topics } from "./topics";
  import { debounce } from "$components/utils";

  const topicsList = topics.filter(d => d[0]).map(d => [d[0], d[1].join(",")]);
  console.log(topicsList);

  export let items = [];

  let selectValue = "";
  let inputValue = "";
  let searchString = "";
  let lastControlChanged = null;

  const updateSearchString = debounce(() => {
    lastControlChanged = "search";
    searchString = inputValue.toLowerCase();
  }, 200);
  $: selectValue = topicsList.find(([name, terms]) => terms == inputValue)
    ? inputValue
    : "";
  $: inputValue, updateSearchString();

  const onUpdateSelectValue = str => {
    inputValue = str.target.value;
    console.log(str);
  };
  $: searchTerms = searchString.split(",");

  $: filteredItems = searchString
    ? items.filter(
        d =>
          searchTerms.filter(term =>
            d.searchString.toLowerCase().includes(term)
          ).length
      )
    : items;

  const onFilterByTerms = str => {
    inputValue = str;
    selectValue = str;
  };
</script>

<div class="controls">
  <input bind:value="{inputValue}" placeholder="Search for specific terms" />
  <select
    class="topics"
    bind:value="{selectValue}"
    on:change="{onUpdateSelectValue}">
    <option value="">or pick a topic</option>
    {#each topicsList as [name, terms]}
      <option value="{terms}" on:click="{() => onFilterByTerms(terms)}">
        {name}
      </option>
    {/each}
  </select>
</div>
<div class="list">
  <VirtualList items="{filteredItems}" component="{ListItem}" />
</div>

<style lang="scss">
  .list {
  }
  .controls {
    padding-left: 2em;
  }
  select {
    padding: 0.4em 0.6em;
    font-size: 1.1em;
    font-family: "Inter", sans-serif;
    width: 10em;
    font-weight: 300;
  }
  input {
    padding: 0.4em 0.6em;
    font-size: 1.1em;
    font-family: "Inter", sans-serif;
    width: 20em;
    font-weight: 600;
  }
  ::placeholder {
    font-weight: 300;
  }
  .unselected {
    background: #ddd;
  }

  @media (max-width: 600px) {
    select,
    input {
      width: 100%;
      max-width: calc(100vw - 6em);
    }
  }
</style>
