const rl = require('readline');
const fs = require('fs');
const readline = rl.createInterface({
  input: fs.createReadStream('./data.csv')
});

function parseCsvLine(str) {
  return Array.from(str.matchAll(/(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g)).map(v => v[1]).map(v => isNaN(v) ? v : +v);
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
  // const colMin = new Array(65).fill(Number.POSITIVE_INFINITY);
  // const colMax = new Array(65).fill(Number.NEGATIVE_INFINITY);
  // data.forEach(v => {
  //   for (let i = 4; i < 69; i++) {
  //     colMin[i - 4] = Math.min(colMin[i - 4], v[i]);
  //     colMax[i - 4] = Math.max(colMax[i - 4], v[i]);
  //   }
  // });
  for (let i = 0; i < data.length; i++) {
    for (let j = 4; j < 69; j++) {
      data[i][j] = (data[i][j] - colMean[j - 4]) / colStd[j - 4];
      // data[i][j] = (data[i][j] - colMean[j - 4]) / (colMax[j - 4] - colMin[j - 4]);
    }
  }

  const categories = new Set(data.map(v => v[3]));
  const output = Array.from(categories.keys()).map((cate, i) => {
    console.log(i);
    const diff = new Array(65).fill(0).map(() => [0, 0]);
    const same = new Array(65).fill(0).map(() => [0, 0]);
    for (let j = 0; j < data.length; j++) {
      const v = data[j];
      for (let a = 4; a < 69; a++) {
        (v[3] === cate ? same : diff)[a - 4][0] += v[a];
        (v[3] === cate ? same : diff)[a - 4][1]++;
      }
    }
    return [cate, diff.map((v, i) => [Math.abs(v[0] / v[1]), Math.abs(same[i][0] / same[i][1]), i])];
  });

  // fs.writeFileSync('./out.json', JSON.stringify(output));
  const dataNames = parseCsvLine(`Food code,Main food description,WWEIA Category number,WWEIA Category description,Energy (kcal),Protein (g),Carbohydrate (g),"Sugars, total (g)","Fiber, total dietary (g)",Total Fat (g),"Fatty acids, total saturated (g)","Fatty acids, total monounsaturated (g)","Fatty acids, total polyunsaturated (g)",Cholesterol (mg),Retinol (mcg),"Vitamin A, RAE (mcg_RAE)","Carotene, alpha (mcg)","Carotene, beta (mcg)","Cryptoxanthin, beta (mcg)",Lycopene (mcg),Lutein + zeaxanthin (mcg),Thiamin (mg),Riboflavin (mg),Niacin (mg),Vitamin B-6 (mg),Folic acid (mcg),"Folate, food (mcg)","Folate, DFE (mcg_DFE)","Folate, total (mcg)","Choline, total (mg)",Vitamin B-12 (mcg),"Vitamin B-12, added (mcg)",Vitamin C (mg),Vitamin D (D2 + D3) (mcg),Vitamin E (alpha-tocopherol) (mg),"Vitamin E, added (mg)",Vitamin K (phylloquinone) (mcg),Calcium (mg),Phosphorus (mg),Magnesium (mg),"Iron (mg)","Zinc (mg)",Copper (mg),Selenium (mcg),Potassium (mg),Sodium (mg),Caffeine (mg),Theobromine (mg),Alcohol (g),"SFA 4:0 (g)","SFA 6:0 (g)","SFA 8:0 (g)","SFA 10:0 (g)","SFA 12:0 (g)","SFA 14:0 (g)","SFA 16:0 (g)","SFA 18:0 (g)","MUFA 16:1 (g)","MUFA 18:1 (g)","MUFA 20:1 (g)","MUFA 22:1 (g)","PUFA 18:2 (g)","PUFA 18:3 (g)","PUFA 18:4 (g)","PUFA 20:4 (g)","PUFA 20:5 n-3 (g)","PUFA 22:5 n-3 (g)","PUFA 22:6 n-3 (g)","Water (g)"`).slice(4);

  const outStream = fs.createWriteStream('./out.log');
  const votes = new Array(65).fill(0);
  output.forEach(([n, d]) => {
    outStream.write(n + '\n');
    d = d.sort((a, b) => Math.abs(b[0] - b[1]) - Math.abs(a[0] - a[1]));
    d.forEach((v, i) => {
      outStream.write(`${dataNames[v[2]]}: ${v[0]}/${v[1]}\n`);
      votes[v[2]] += 65 - i;
    });
  });
  console.log(votes.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).map((v, i) => `#${(i + 1).toString().padStart(2, ' ')}: ${dataNames[v[1]].padEnd(40, '-')} | ${v[0]} votes`).join('\n'));
  console.log(votes.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).map(v => dataNames[v[1]]));

  outStream.close();
});