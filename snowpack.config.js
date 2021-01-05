// Consult https://www.snowpack.dev to learn about these options
module.exports = {
  extends: "@sveltejs/snowpack-config",
  installOptions: {
    rollup: {
      plugins: [require("@rollup/plugin-dsv")()],
    },
  },
  mount: {
    "src/components": "/_components",
  },
  alias: {
    $components: "./src/components",
    $src: "./src",
  },
};
