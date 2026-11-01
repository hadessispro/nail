const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

function getMime(file) {
  if (file.endsWith('.html')) return 'text/html';
  if (file.endsWith('.js')) return 'application/javascript';
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.json')) return 'application/json';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

const artifactDir = 'C:/Users/thaibao/.gemini/antigravity/brain/e595c419-61f6-4cfe-88c9-b94d3aaf3013';

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': getMime(filePath) });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(4173, async () => {
  console.log('Test server running at http://localhost:4173');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => console.log('PAGE:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    await page.goto('http://localhost:4173', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1000));

    // Ensure English
    await page.evaluate(() => {
      localStorage.setItem('rose_pos_lang', 'en');
      window.__pos_lang = 'en';
    });
    await page.reload({ waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Nav Rail screenshot & button text inspection
    const navTexts = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('nav a'));
      return links.map(l => l.innerText.replace(/\s+/g, ' ').trim());
    });
    console.log('Nav button texts in English:', navTexts);

    const navRail = await page.$('nav[aria-label="Main Navigation"], nav[aria-label="Điều hướng chính"]');
    if (navRail) {
      await navRail.screenshot({
        path: path.join(artifactDir, 'nav_rail_english_verified.png')
      });
      console.log('[OK] Saved nav_rail_english_verified.png');
    }

    // 2. Open PIN Modal by clicking locked section (e.g. Reports)
    console.log('Clicking Reports to trigger PIN modal...');
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('nav a'));
      const rep = links.find(l => l.getAttribute('href') === '#/reports' || l.innerText.includes('Reports'));
      if (rep) rep.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Capture PIN modal screenshot
    await page.screenshot({
      path: path.join(artifactDir, 'pin_modal_no_demo_verified.png')
    });
    console.log('[OK] Saved pin_modal_no_demo_verified.png');

    const modalText = await page.evaluate(() => document.body.innerText);
    const hasPinDemo = modalText.includes('1234') || modalText.includes('demo:');
    console.log('Does PIN modal contain any 1234 / demo text?:', hasPinDemo);

    // 3. Unlock with 1234
    console.log('Unlocking manager area with default 1234...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const clickNum = (num) => btns.find(b => b.innerText.trim() === num)?.click();
      clickNum('1'); clickNum('2'); clickNum('3'); clickNum('4');
    });
    await new Promise(r => setTimeout(r, 1000));

    // Navigate to Settings
    console.log('Navigating to Settings...');
    await page.evaluate(() => {
      window.location.hash = '#/settings';
    });
    await new Promise(r => setTimeout(r, 1000));

    // Change PIN to 7890
    console.log('Changing PIN to 7890 in Settings...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const pinInput = inputs.find(i => i.getAttribute('placeholder') === '••••');
      if (pinInput) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(pinInput, '7890');
        pinInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.innerText.includes('Save') || b.innerText.includes('PIN') || b.innerText.includes('Lưu'));
      saveBtn?.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const storedPin = await page.evaluate(() => localStorage.getItem('rose_pos_custom_pin'));
    console.log('Verified localStorage custom PIN:', storedPin);

    // Lock and reload to test persistence
    console.log('Reloading to verify custom PIN persistence...');
    await page.evaluate(() => {
      window.location.hash = '#/';
    });
    await page.reload({ waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1200));

    // Try going to Reports again
    await page.evaluate(() => {
      window.location.hash = '#/reports';
    });
    await new Promise(r => setTimeout(r, 800));

    // Try old PIN 1234 (must fail!)
    console.log('Attempting unlock with old PIN 1234 (expecting failure)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const clickNum = (num) => btns.find(b => b.innerText.trim() === num)?.click();
      clickNum('1'); clickNum('2'); clickNum('3'); clickNum('4');
    });
    await new Promise(r => setTimeout(r, 800));

    const oldPinRejected = await page.evaluate(() => {
      return window.location.hash !== '#/reports' || !!document.querySelector('.text-danger');
    });
    console.log('Old PIN 1234 properly REJECTED?:', oldPinRejected);

    // Now enter new custom PIN 7890 (must succeed!)
    console.log('Attempting unlock with new custom PIN 7890...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const clickNum = (num) => btns.find(b => b.innerText.trim() === num)?.click();
      clickNum('7'); clickNum('8'); clickNum('9'); clickNum('0');
    });
    await new Promise(r => setTimeout(r, 1000));

    const newPinSuccess = await page.evaluate(() => {
      return !document.querySelector('.text-danger') && (window.location.hash === '#/reports');
    });
    console.log('New PIN 7890 properly ACCEPTED and unlocked?:', newPinSuccess);

    // Screenshot Reports open
    await page.screenshot({
      path: path.join(artifactDir, 'live_unlocked_reports.png')
    });
    console.log('[OK] Saved live_unlocked_reports.png');

    // Reset PIN back to 1234 for normal demo state if desired, or leave it configurable
    await page.evaluate(() => {
      localStorage.setItem('rose_pos_custom_pin', '1234');
    });

  } finally {
    await browser.close();
    server.close();
    console.log('Test completed and server closed.');
  }
});
