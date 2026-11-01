const fs = require('fs');
const html = fs.readFileSync('C:/Users/thaibao/.gemini/antigravity/scratch/nails-store-pos/index.html', 'utf8');

// Find all occurrences of pin in the store and settings
console.log('--- PIN SEARCH ---');
let p = 0;
while ((p = html.indexOf('.pin', p)) !== -1) {
  console.log(html.slice(Math.max(0, p - 60), Math.min(html.length, p + 100)));
  p += 4;
}

console.log('--- RESET SEARCH ---');
p = 0;
while ((p = html.indexOf('resetDemo', p)) !== -1) {
  console.log(html.slice(Math.max(0, p - 60), Math.min(html.length, p + 100)));
  p += 9;
}
