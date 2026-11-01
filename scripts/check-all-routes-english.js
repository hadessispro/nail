const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
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

server.listen(4183, async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  const routes = ['#/floor', '#/appointments', '#/customers', '#/history', '#/vouchers', '#/loyalty', '#/customer'];
  
  // Set English
  await page.goto('http://localhost:4183/#/');
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => { localStorage.setItem('rose_pos_lang', 'en'); window.__pos_lang = 'en'; });
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 800));

  for (const route of routes) {
    await page.goto('http://localhost:4183/' + route);
    await new Promise(r => setTimeout(r, 800));
    const text = await page.evaluate(() => document.body.innerText);
    
    // Check if any Vietnamese diacritics exist (excluding Vietnamese customer/tech names)
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const vnLines = [];
    for (const l of lines) {
      // Ignore known Vietnamese names
      if (/Cindy|Pam|Hồng Đào|Quang Minh|Henry|Khánh Hà|Jenny|Linda|Nguyễn|Trần|Lê|Phạm|Võ|Bùi|Đặng|Hoàng|Tâm/i.test(l)) continue;
      if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i.test(l)) {
        vnLines.push(l);
      }
    }
    console.log(`=== ROUTE ${route} (Remaining VN lines: ${vnLines.length}) ===`);
    if (vnLines.length > 0) {
      console.log('Sample VN lines in', route, ':', vnLines.slice(0, 10));
    }
  }

  await browser.close();
  server.close();
});
