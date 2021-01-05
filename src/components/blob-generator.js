// snagged from https://github.com/lokesh-coder/blobs.app/blob/master/src/services/generator.js

// MIT License

// Copyright (c) 2020 udaypydi

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export const generator = ({ size = 10, growth = 6, edges = 10 } = {}) => {
  var { destPoints, id } = _createPoints(size, growth, edges);
  var path = _createSvgPath(destPoints);
  return { path, id };
};

const _toRad = (deg) => deg * (Math.PI / 180.0);

const _divide = (count) => {
  var deg = 360 / count;

  return Array(count)
    .fill("a")
    .map((_, i) => i * deg);
};

const _randomDoubleGenerator = (s) => {
  var mask = 0xffffffff;
  var m_w = (123456789 + s) & mask;
  var m_z = (987654321 - s) & mask;

  return function () {
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

    var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  };
};

const _magicPoint = (value, min, max) => {
  let radius = min + value * (max - min);
  if (radius > max) {
    radius = radius - min;
  } else if (radius < min) {
    radius = radius + min;
  }
  return radius;
};

const _point = (origin, radius, degree) => {
  var x = origin + radius * Math.cos(_toRad(degree));
  var y = origin + radius * Math.sin(_toRad(degree));
  return [Math.round(x), Math.round(y)];
};

const _shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
  return array;
};

const _createPoints = (size, minGrowth, edgesCount) => {
  let outerRad = size / 2;
  let innerRad = minGrowth * (outerRad / 10);
  let center = size / 2;

  let slices = _divide(edgesCount);
  let maxRandomValue = _shuffle([99, 999, 9999, 99999, 999999])[0];
  let id = Math.floor(Math.random() * maxRandomValue);
  let seedValue = id;
  let randVal = _randomDoubleGenerator(seedValue);
  let destPoints = [];

  slices.forEach((degree) => {
    let O = _magicPoint(randVal(), innerRad, outerRad);
    let end = _point(center, O, degree);
    destPoints.push(end);
  });
  return { destPoints, id };
};

const _createSvgPath = (points) => {
  let svgPath = "";
  var mid = [
    (points[0][0] + points[1][0]) / 2 / 10,
    (points[0][1] + points[1][1]) / 2 / 10,
  ];
  svgPath += `M${mid[0]},${mid[1]}`;

  for (var i = 0; i < points.length; i++) {
    var p1 = points[(i + 1) % points.length];
    var p2 = points[(i + 2) % points.length];
    mid = [(p1[0] + p2[0]) / 2 / 10, (p1[1] + p2[1]) / 2 / 10];
    svgPath += `Q${p1[0] / 10},${p1[1] / 10},${mid[0]},${mid[1]}`;
  }
  svgPath += "Z";
  return svgPath;
};
