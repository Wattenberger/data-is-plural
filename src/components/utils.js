import { timeParse } from "d3";

import rawData from "$components/datasets.js";
import { topicToSlugMap } from "$components/topics.js";

export const fromPairs = (arr) => {
  let res = {};
  arr.forEach((d) => {
    res[d[0]] = d[1];
  });
  return res;
};

export const pickFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const randomBetween = (min, max) => min + Math.random() * (max - min);

let id = 0;
export const getUniqueId = () => {
  id++;
  return id;
};

export const getId = (d) => [d.edition, d.position].join("--");

export const data = rawData
  .map((d) => {
    const searchString = [d.headline, d.text].join(", ").toLowerCase();
    const topics = searchString
      .split(" ")
      .map((d) => topicToSlugMap[d])
      .filter((d) => d);
    return {
      ...d,
      id: getId(d),
      searchString,
      topics,
      date: timeParse("%Y.%m.%d")(d.edition),
    };
  })
  .reverse();

// from https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func, wait, immediate) => {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
