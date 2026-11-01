const fs = require('fs');
const html = fs.readFileSync('C:/Users/thaibao/.gemini/antigravity/scratch/nails-store-pos/index.html', 'utf8');

const target = 'PIN demo: ';
let p = 0;
while ((p = html.indexOf(target, p)) !== -1) {
  if (p > 50000) {
    console.log('Found in code at', p);
    console.log(html.slice(p - 300, p + 300));
  }
  p += target.length;
}
