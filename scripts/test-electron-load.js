const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      webSecurity: false
    }
  });

  const distHtml = path.join(__dirname, '../dist/index.html');
  console.log('Loading:', distHtml);
  await win.loadFile(distHtml);
  
  // Wait 2 seconds for react to mount
  await new Promise(r => setTimeout(r, 2000));

  const title = await win.getTitle();
  console.log('Window Title:', title);

  const image = await win.capturePage();
  const artifactPath = 'C:/Users/thaibao/.gemini/antigravity/brain/e595c419-61f6-4cfe-88c9-b94d3aaf3013/test_electron_loaded.png';
  fs.writeFileSync(artifactPath, image.toPNG());
  console.log('Saved test_electron_loaded.png');

  app.quit();
});
