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

server.listen(4184, async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  await page.goto('http://localhost:4184/#/');
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => { localStorage.setItem('rose_pos_lang', 'en'); window.__pos_lang = 'en'; });
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 800));

  // Unlock admin
  await page.goto('http://localhost:4184/#/reports');
  await new Promise(r => setTimeout(r, 800));
  for (const digit of ['1', '2', '3', '4']) {
    await page.evaluate((d) => {
      const btns = Array.from(document.querySelectorAll('button'));
      btns.find(el => el.innerText.trim() === d)?.click();
    }, digit);
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 1000));

  const adminRoutes = ['#/reports', '#/services', '#/technicians', '#/receipt', '#/settings'];
  for (const route of adminRoutes) {
    await page.goto('http://localhost:4184/' + route);
    await new Promise(r => setTimeout(r, 800));
    const text = await page.evaluate(() => document.body.innerText);
    
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const vnLines = [];
    for (const l of lines) {
      if (/Cindy|Pam|Hồng Đào|Quang Minh|Henry|Khánh Hà|Jenny|Linda|Nguyễn|Trần|Lê|Phạm|Võ|Bùi|Đặng|Hoàng|Tâm|Orlando|Colonial|Epson/i.test(l)) continue;
      if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i.test(l)) {
        vnLines.push(l);
      }
    }
    console.log(`=== ADMIN ROUTE ${route} (Remaining VN lines: ${vnLines.length}) ===`);
    if (vnLines.length > 0) {
      console.log('Sample VN lines in', route, ':', vnLines.slice(0, 10));
    }
  }

  await browser.close();
  server.close();
});
