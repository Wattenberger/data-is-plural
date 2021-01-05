<script>
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";
  import Zdog from "zdog";

  import { pickFrom, randomBetween } from "./utils.js";

  export let illo;
  export let colors;

  const shapes = ["hemi", "cone", "squiggle"];

  let pos = spring([0, 0, 0], {
    damping: randomBetween(0.5, 1),
    tension: randomBetween(0.3, 0.6)
  });
  let anchor;

  onMount(() => {
    if (!illo) return;

    const shape = pickFrom(shapes);

    pos.set([
      randomBetween(-160, 160),
      randomBetween(-260, -90),
      randomBetween(-160, 160)
    ]);

    anchor = new Zdog.Anchor({
      addTo: illo,
      translate: { x: -4, y: -4 },
      scale: 10,
      rotate: {
        x: Math.PI * randomBetween(-2, 2),
        y: Math.PI * randomBetween(-2, 2),
        z: Math.PI * randomBetween(-2, 2)
      }
    });

    if (shape == "hemi") {
      const hemi = new Zdog.Hemisphere({
        diameter: 2,
        addTo: anchor,
        color: colors[0],
        backface: colors[1],
        stroke: false
      });

      hemi.copy({
        rotate: { y: Math.PI },
        color: colors[1],
        backface: colors[0]
      });
    } else if (shape == "cone") {
      new Zdog.Cone({
        addTo: anchor,
        diameter: 2,
        length: 2,
        translate: { z: 1 },
        color: colors[0],
        backface: colors[1],
        stroke: false
      });
    } else if (shape == "squiggle") {
      const x = randomBetween(-2, 2);
      const z = randomBetween(-2, 2);
      const points = [
        { x: 0, y: -2, z: 0 },
        { x: -x, y: -1, z: -z },
        { x: 0, y: 0, z: 0 },
        { x: x, y: 1, z: z },
        { x: 0, y: 2, z: 0 }
      ];
      new Zdog.Shape({
        addTo: anchor,
        diameter: 2,
        length: 2,
        translate: { z: 1 },
        color: pickFrom(colors),
        stroke: 10,
        closed: false,
        path: [
          points[0],
          {
            bezier: [points[0], points[1], points[2]]
          },
          {
            bezier: [points[2], points[3], points[4]]
          }
        ]
      });
    }
  });

  $: {
    if (anchor) {
      anchor.translate = {
        x: $pos[0],
        y: $pos[1],
        z: $pos[2]
      };
    }
  }
</script>
