<script>
  import List from "$components/List.svelte";
  import Footer from "$components/Footer.svelte";
  import { data } from "$components/utils";
</script>

<main>
  <h1>
    <a href="https://github.com/data-is-plural/newsletter-archive">
      Data is Plural
    </a>
    archive
  </h1>
  <div class="info">
    Trawl through the backlog, or
    <a href="/random">roll the dice for a random dataset 🎲</a>
  </div>

  <List items="{data}" />
</main>

<Footer />

<style lang="scss">
  @import url("https://rsms.me/inter/inter.css");
  :root {
    font-family: "Inter", sans-serif;
    font-size: 1.1em;
    line-height: 1.6em;
    color: #1d1d1d;
    // background: #b2abab;
  }

  main {
    padding: 3em 0;
    margin: 0 auto;
  }

  h1 {
    margin-left: 2rem;
    margin-bottom: 0.5em;
    font-weight: 300;
    letter-spacing: -0.016em;
  }

  p {
  }
  :global(a) {
    color: #796c94;
    font-weight: 600;
  }
  :global(a):visited {
    color: #bd8374;
  }
  :global(button) {
    appearance: none;
    background: #796c94;
    padding: 0.6em 1em;
    color: #000;
    cursor: pointer;
    border: none;
    font-weight: 700;
    font-size: 1em;
    color: white;
    box-shadow: none;
  }
  :global(button:active),
  :global(button:focus) {
    background: #bd8374;
  }
  .info {
    margin-left: 2em;
    margin-bottom: 2em;
  }
</style>
