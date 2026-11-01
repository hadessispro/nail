const fs = require('fs');
const bad = JSON.parse(fs.readFileSync('C:/Users/thaibao/.gemini/antigravity/scratch/nails-store-pos/scripts/bad_translations.json', 'utf8'));

console.log('Total bad entries:', bad.length);
const realStrings = bad.filter(b => !/^[<>$(\/.]/.test(b.vi));
console.log('Real UI strings count:', realStrings.length);
console.log('Sample 40:');
realStrings.slice(0, 40).forEach(b => console.log(JSON.stringify(b.vi), '=>', JSON.stringify(b.en)));
