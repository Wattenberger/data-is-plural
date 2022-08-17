import sveltePreprocess from "svelte-preprocess"
import adapter from "@sveltejs/adapter-netlify"

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$components': 'src/components'
    }
  },
};