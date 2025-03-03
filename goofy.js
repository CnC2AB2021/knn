const rl = require('readline');
const fs = require('fs');
const readline = rl.createInterface({
  input: fs.createReadStream('./data.csv')
});

function parseCsvLine(str) {
  return Array.from(str.matchAll(/(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g)).map(v => v[1]).map(v => isNaN(v) ? v : +v);
}

function getOrDefault(map, key, def) {
  let a;
  return map.get(key) ?? (a = def(), map.set(key, a), a);
}

let skip = 3;
const data = [];
readline.on('line', l => {
  if (skip === 1) console.log(parseCsvLine(l).map((v, i) => [i, v]));
  if (skip-- > 0) return;
  data.push(parseCsvLine(l));
});

readline.once('close', () => {
  const colSum = new Array(65).fill(0);
  data.forEach(v => {
    for (let i = 4; i < 69; i++) colSum[i - 4] += v[i];
  });
  const colMean = colSum.map(v => v / data.length);
  colSum.fill(0);
  data.forEach(v => {
    for (let i = 4; i < 69; i++) colSum[i - 4] += (v[i] - colMean[i - 4]) ** 2;
  });
  const colStd = colSum.map(v => Math.sqrt(v / data.length));
  for (let i = 0; i < data.length; i++) {
    for (let j = 4; j < 69; j++) {
      data[i][j] = (data[i][j] - colMean[j - 4]) / colStd[j - 4];
    }
  }

  const sums = new Map();
  for (let i = 0; i < data.length; i++) {
    console.log(i, data.length);
    const v = data[i];
    const cate = v[3];
    const arr = getOrDefault(sums, cate, () => new Array(65).fill(0).map(() => [0, 0, 0, 0]));
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue;
      const r = data[j];
      for (let a = 4; a < 69; a++) {
        const d = Math.abs(r[a] - v[a]);
        arr[a - 4][r[3] === v[3] ? 1 : 0] += d;
        arr[a - 4][r[3] === v[3] ? 3 : 2]++;
      }
    }
  }

  fs.writeFileSync('./out.json', JSON.stringify(Array.from(sums.entries()).map(v => [v[0], v[1].map((v, i) => [v[0] / v[2], v[1] / v[3], i])])));
});