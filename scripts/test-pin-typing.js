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

server.listen(4175, async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Go to home, unlock admin
  await page.goto('http://localhost:4175/#/');
  await new Promise(r => setTimeout(r, 1000));

  // Unlock admin directly in store or via UI
  await page.evaluate(() => {
    // Navigate to settings
    window.location.hash = '#/settings';
  });
  await new Promise(r => setTimeout(r, 800));

  // Click on the PIN pad to unlock
  console.log('Unlocking admin...');
  for (const digit of ['1', '2', '3', '4']) {
    const btn = (await page.$$('button')).find(async b => (await page.evaluate(el => el.innerText.trim(), b)) === digit);
    await page.evaluate((d) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(el => el.innerText.trim() === d);
      b?.click();
    }, digit);
    await new Promise(r => setTimeout(r, 200));
  }
  await new Promise(r => setTimeout(r, 800));

  // Now we are in Settings
  const pinInput = await page.$('input[placeholder="••••"]');
  if (pinInput) {
    console.log('Found pin input! Focusing and typing 8888...');
    await pinInput.focus();
    await page.keyboard.type('8888');
    await new Promise(r => setTimeout(r, 500));

    // Find Save button
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      const disabled = await page.evaluate(el => el.disabled, btn);
      if (text.includes('PIN') || text.includes('Lưu') || text.includes('Save')) {
        console.log('Found button:', text, 'disabled:', disabled);
        if (!disabled) {
          await btn.click();
          console.log('Clicked save button!');
        }
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // Check custom PIN
    const customPin = await page.evaluate(() => localStorage.getItem('rose_pos_custom_pin'));
    console.log('localStorage rose_pos_custom_pin:', customPin);

    const storePin = await page.evaluate(() => {
      const raw = localStorage.getItem('rose-nails-pos/v2');
      return raw ? JSON.parse(raw).state?.settings?.pin : null;
    });
    console.log('Zustand store settings.pin:', storePin);

    // Now reload page and try unlocking with 8888
    console.log('Reloading page to test persistence...');
    await page.reload({ waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 1000));

    // Go to reports
    await page.evaluate(() => { window.location.hash = '#/reports'; });
    await new Promise(r => setTimeout(r, 800));

    // Enter old PIN 1234
    console.log('Attempting old PIN 1234...');
    for (const digit of ['1', '2', '3', '4']) {
      await page.evaluate((d) => {
        const btns = Array.from(document.querySelectorAll('button'));
        btns.find(el => el.innerText.trim() === d)?.click();
      }, digit);
      await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 800));
    const stillLocked = await page.evaluate(() => window.location.hash !== '#/reports' || !!document.querySelector('.text-danger'));
    console.log('Old PIN 1234 rejected?:', stillLocked);

    // Enter new PIN 8888
    console.log('Attempting new PIN 8888...');
    for (const digit of ['8', '8', '8', '8']) {
      await page.evaluate((d) => {
        const btns = Array.from(document.querySelectorAll('button'));
        btns.find(el => el.innerText.trim() === d)?.click();
      }, digit);
      await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 1000));
    const unlocked = await page.evaluate(() => !document.querySelector('.text-danger') && window.location.hash === '#/reports');
    console.log('New PIN 8888 successfully unlocked?:', unlocked);

    // Clean up test PIN
    await page.evaluate(() => {
      localStorage.setItem('rose_pos_custom_pin', '1234');
    });
  } else {
    console.log('PIN input not found in Settings!');
  }

  await browser.close();
  server.close();
});
