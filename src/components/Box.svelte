<script>
  import * as d3 from "d3";

  export let width = 9;
  export let height = 9;
  export let depth = 9;
  export let colors = ["#1C302F", "#F1B79F"];

  const updateSaturation = (color, saturationDiff = 0.2) => {
    let newColor = d3.hsl(color.formatHex());
    if (!newColor) return color;
    newColor.s += saturationDiff;
    return newColor;
  };

  $: interp = d3.interpolate(
    updateSaturation(d3.color(colors[0]))
      .darker(2)
      .formatHex(),
    updateSaturation(d3.color(colors[0]), 0.4)
      .brighter(16)
      .darker(-6)
      .formatHex()
  );
  $: interp2 = d3.interpolate(
    updateSaturation(d3.color(colors[1]))
      .darker(0)
      .formatHex(),
    updateSaturation(d3.color(colors[1]))
      .brighter(9)
      .darker(-9)
      .formatHex()
  );

  let x = -76;
  let y = -66;
  let z = 25;

  $: sideColors = [
    [interp(0.3), interp(0.5)], // right
    [interp(0.1), interp(0.3)], // back right
    [interp(0.1), interp(0.3)], // back left
    [interp(0.2), interp(0.4)], // left
    [interp(0.6), interp(0.7)], // top
    [interp(0.1), interp(0.1)] // bottom
  ];
  $: sideColors2 = [
    [interp2(0.3), interp2(0.5)], // right
    [interp2(0.1), interp2(0.3)], // back right
    [interp2(0.1), interp2(0.3)], // back left
    [interp2(0.2), interp2(0.4)], // left
    [interp2(0.6), interp2(0.7)], // top
    [interp2(0.6), interp2(0.66)] // top, horizontal
  ];

  const getFaceStyles = (i = 0, scale = 1) =>
    [
      ...(i == 4
        ? [
            ["width", `${depth * scale}em`].join(": "),
            ["height", `${width * scale}em`].join(": "),
            [
              "margin",
              `${height * -0.5 * scale}em ${height * -0.5 * scale}em`
            ].join(": "),
            [
              "transform",
              `rotate3d(var(--i), var(--j), 0, var(--a)) translateZ(${width *
                0.5 *
                scale}em)`
            ].join(": ")
          ]
        : i == 5
        ? [
            ["width", `${depth * scale}em`].join(": "),
            ["height", `${width * scale}em`].join(": "),
            [
              "margin",
              `${depth * -0.5 * scale}em ${height * -0.5 * scale}em`
            ].join(": "),
            [
              "transform",
              `rotate3d(var(--i), var(--j), 0, var(--a)) translateZ(${0}em)`
            ].join(": ")
          ]
        : [
            ["width", `${(i % 2 ? width : depth) * scale}em`].join(": "),
            ["height", `${(i % 2 ? height : height) * scale}em`].join(": "),
            [
              "margin",
              `${height * -0.5 * scale}em ${height * -0.5 * scale}em`
            ].join(": "),
            [
              "transform",
              `rotate3d(var(--i), var(--j), 0, var(--a)) translateZ(${(i % 2
                ? depth
                : width) *
                0.5 *
                scale}em)`
            ].join(": ")
          ])
    ].join("; ");

  const getRibbonStyles = (i = 0) =>
    [
      ...(i == 4
        ? [
            ["width", `${depth * 0.3}em`].join(": "),
            ["height", `${width * 1.02}em`].join(": "),
            ["margin", `${height * -0.5}em ${(depth - height) * 0.25}em`].join(
              ": "
            ),
            [
              "transform",
              `rotate3d(var(--i), var(--j), 0, var(--a)) translateZ(${depth *
                0.52}em)`
            ].join(": ")
          ]
        : i == 5
        ? [
            ["width", `${width * 0.57}em`].join(": "),
            ["height", `${depth * 0.4}em`].join(": "),
            // `${width * ([5].includes(i) ? -0.14 : -0.51)}em ${height * ([5].includes(i) ? -0.5 : -0.15)}em`
            ["margin", `${height * -0.2}em ${height * -0.5}em`].join(": "),
            [
              "transform",
              `rotate3d(var(--i), var(--j), 0, var(--a)) translateZ(${height *
                0.52}em)`
            ].join(": ")
          ]
        : [
            [
              "width",
              `${(i % 2 ? width : depth) *
                ([2, 5].includes(i) ? 1.02 : 0.3) *
                (i == 2 ? 0 : 1)}em`
            ].join(": "),
            [
              "height",
              `${(i % 2 ? height : height) *
                ([2, 5].includes(i) ? 0.3 : 1.016)}em`
            ].join(": "),
            [
              "margin",
              `${height * -0.51}em ${
                i % 2 ? depth * -0.15 : (depth - height) * 0.25
              }em`
            ].join(": "),
            [
              "transform",
              `rotate3d(var(--i), var(--j), 0, var(--a)) translateZ(${(i % 2
                ? height
                : width) * 0.51}em)`
            ].join(": ")
          ])
    ].join("; ");
</script>

<div class="gift" style=" --i: {y}; --j: {x}; --a: {z}deg;">
  {#each new Array(6).fill(0) as _, i}
    <div
      class="face"
      style="--a: {(i < 4 ? i : Math.pow(-1, i)) * 90}deg; background:
      linear-gradient(0, {sideColors[i].join(', ')}); {getFaceStyles(i, 1)}"></div>
  {/each}
  {#each new Array(6).fill(0) as _, i}
    <span
      class="face face-back"
      style="--a: {(i < 4 ? i : Math.pow(-1, i)) * 90}deg; background:
      linear-gradient(0, {interp(0.4)}, {interp(0.5)});{getFaceStyles(i, 0.98)}"></span>
  {/each}
  <div>
    {#each new Array(6).fill(0) as _, i}
      <div
        class="face ribbon"
        style="--a: {i < 4 ? i * 90 : 90}deg; background: linear-gradient(0, {sideColors2[i].join(', ')});{getRibbonStyles(i)};
        "></div>
    {/each}
  </div>
</div>

<style lang="scss">
  :root {
    perspective: 45em;
  }

  .gift {
    appearance: none;
    border: none;
    box-shadow: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-style: preserve-3d;
    transform: rotate3d(var(--i, -7), var(--j, 8), 0, var(--a, 45deg))
      var(--p, unquote(" "));
    cursor: pointer;
  }

  .face {
    position: absolute;

    border-radius: 1em;
    // backface-visibility: hidden;
    --i: 0;
    --j: 1;

    &:nth-of-type(n + 5) {
      --i: 1;
      --j: 0;
    }
  }
  .face-back {
    border-radius: 0;
  }
  .ribbon {
    border-radius: 0;
  }
</style>
