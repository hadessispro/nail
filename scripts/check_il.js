const fs = require('fs');
const html = fs.readFileSync('C:/Users/thaibao/.gemini/antigravity/scratch/nails-store-pos/index.html', 'utf8');

const target = 'q.getState().seedDate!==';
const idx = html.indexOf(target);
const snippet = html.slice(idx, idx + 100);
console.log('Snippet:', snippet);
// Find what Il is:
const match = snippet.match(/seedDate!==([a-zA-Z0-9_$]+)\(\)/);
console.log('Match function name:', match ? match[1] : 'none');
if (match) {
  const fnName = match[1];
  let p = 0;
  while ((p = html.indexOf(fnName, p)) !== -1) {
    console.log(`Found ${fnName} at ${p}:`, html.slice(Math.max(0, p - 30), Math.min(html.length, p + 50)));
    p += fnName.length;
    if (p > 500000) break;
  }
}
