const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const artifactDir = 'C:/Users/thaibao/.gemini/antigravity/brain/e595c419-61f6-4cfe-88c9-b94d3aaf3013';

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'Content-Type': filePath.endsWith('.js') ? 'application/javascript' : filePath.endsWith('.css') ? 'text/css' : 'text/html' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

server.listen(4180, async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  await page.goto('http://localhost:4180/#/');
  await new Promise(r => setTimeout(r, 1000));

  // Set English
  await page.evaluate(() => {
    localStorage.setItem('rose_pos_lang', 'en');
    window.__pos_lang = 'en';
  });
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot POS main screen
  await page.screenshot({ path: path.join(artifactDir, 'verify_full_english_pos.png') });
  console.log('[OK] Captured verify_full_english_pos.png');

  // Check specific strings from user screenshot
  const pageText = await page.evaluate(() => document.body.innerText);

  const checks = [
    { target: 'SẢN PHẨM', shouldExist: false },
    { target: 'FEATURED PRODUCTS', shouldExist: true },
    { target: 'Products chăm sóc móng chính hãng tại tiệm', shouldExist: false },
    { target: 'Authentic salon nail care products', shouldExist: true },
    { target: 'Hàng chờ trống', shouldExist: false },
    { target: 'Waitlist is empty', shouldExist: true },
    { target: 'Invoices đang mở', shouldExist: false },
    { target: 'Open Tickets', shouldExist: true },
    { target: 'Mở màn hình clients iPad', shouldExist: false },
    { target: 'Open iPad Kiosk', shouldExist: true },
    { target: 'Bàn 1', shouldExist: false },
    { target: 'Table 1', shouldExist: true },
    { target: 'Ghế 2', shouldExist: false },
    { target: 'Chair 2', shouldExist: true }
  ];

  console.log('=== STRING VERIFICATION RESULTS ===');
  let passCount = 0;
  for (const c of checks) {
    const exists = pageText.includes(c.target);
    const passed = exists === c.shouldExist;
    console.log(`${passed ? '[PASS]' : '[FAIL]'} "${c.target}" (expected exists: ${c.shouldExist}, actual: ${exists})`);
    if (passed) passCount++;
  }
  console.log(`Passed ${passCount}/${checks.length} checks.`);

  await browser.close();
  server.close();
});
