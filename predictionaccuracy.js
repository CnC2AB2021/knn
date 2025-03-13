const rl = require('readline');
const fs = require('fs');

const readline = rl.createInterface({ input: fs.createReadStream('./prediction.log') });

let correct = [];
let total = 0;

readline.on('line', l => {
  /** @type {[['string', number][], ['string', 'string']]} */
  const [guesses, [foodName, category]] = eval(l.replaceAll('(', '[').replaceAll(')', ']'));
  guesses.forEach((v, i) => {
    correct[i] = (correct[i] || 0) + (v[0] === category);
  });

  total++;
});

readline.once('close', () => {
  correct.reduce((a, v, i) => {
    a += v;
    console.log(`${i + 1} guess: aggregate ${a / total} | marginal ${v / total}`);
    return a;
  }, 0);
});