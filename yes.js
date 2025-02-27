/** @type {Record<string, (number & { name: string })[]>} */
const X = [];
/** @type {number[]} */
const y = [];
/** @type {string[]} */
const features = [];
/** @type {Set<string>} */
const types = new Set();
features.map(v => {
  const o = Array.from(types.keys()).map(v => [v, [0, 0]]);
  X[v].forEach((v, i) => {
    X[v].forEach((f, k) => {
      const d = Math.abs(v - f);
      if (v.name === f.name) o[v.name][0] += d;
      else o[v.name][`0`] += d;
    });
  });
});