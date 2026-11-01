const fs = require('fs');
const html = fs.readFileSync('C:/Users/thaibao/.gemini/antigravity/scratch/nails-store-pos/index.html', 'utf8');

// Find all occurrences of 1234 or PIN hints
const regex = /([^\n\r]*1234[^\n\r]*)/g;
let m;
while ((m = regex.exec(html)) !== null) {
  if (!m[0].includes('__POS_DICT') && !m[0].includes('narrow') && !m[0].includes('quarter')) {
    console.log('Match:', m[0].trim().slice(0, 150));
  }
}
