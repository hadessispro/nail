const fs = require('fs');
const html = fs.readFileSync('C:/Users/thaibao/.gemini/antigravity/scratch/nails-store-pos/index.html', 'utf8');

// Find PIN change in settings
const target = 'Đổi mã PIN';
let p = 0;
while ((p = html.indexOf(target, p)) !== -1) {
  console.log('Found Đổi mã PIN at', p);
  console.log(html.slice(p - 200, p + 500));
  p += target.length;
}
