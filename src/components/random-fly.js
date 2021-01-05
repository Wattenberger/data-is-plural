import { scaleLinear, easeCubicOut } from "d3";

export default function randomFly(
  node,
  {
    delay = 0,
    duration = 1300,
    easing = easeCubicOut,
    x = 0,
    y = 0,
    rotation = 0,
    scale = 0,
  }
) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const xScale = scaleLinear([0, x]);
  const yScale = scaleLinear([0, y]);
  const rotationScale = scaleLinear([0, rotation]);
  const scaleScale = scaleLinear([0, scale]).domain([0, 0.9]);

  return {
    delay,
    duration,
    easing,
    css: (t) => {
      return [
        `transform: translate(${xScale(t)}px, ${yScale(
          t
        )}px) rotate(${rotationScale(t)}deg)`,
        `opacity: ${t * opacity}`,
      ].join(";");
    },
  };
}
