const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const os = require('os');

// Force Single Instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

// App Name for clean AppData directory (%APPDATA%\Rose Nail Spa POS\)
app.setName('Rose Nail Spa POS');

let mainWindow = null;
let tray = null;
let httpServer = null;
let lanPort = 5000;
let localIp = '127.0.0.1';

// Discover Local Network IP (e.g. 192.168.1.50)
function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const ifaceList = interfaces[devName];
    for (let i = 0; i < ifaceList.length; i++) {
      const alias = ifaceList[i];
      if (alias.family === 'IPv4' && !alias.internal && alias.address !== '127.0.0.1') {
        return alias.address;
      }
    }
  }
  return '127.0.0.1';
}

localIp = getLocalNetworkIp();

// Start Built-in LAN HTTP Server for iPad / Secondary Screen
function startLocalServer(port = 5000) {
  const server = http.createServer((req, res) => {
    // Enable CORS for LAN access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // API: Customer Check-in from iPad
    if (req.url === '/api/checkin' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('lan-customer-checkin', data);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, message: 'Check-in received' }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: e.message }));
        }
      });
      return;
    }

    // Static Files
    const basePath = path.join(__dirname, '..');
    let reqUrl = req.url.split('?')[0].split('#')[0];
    if (reqUrl === '/') reqUrl = '/index.html';

    let filePath = path.join(basePath, reqUrl);
    // If not found in root, check in dist/
    if (!fs.existsSync(filePath)) {
      filePath = path.join(basePath, 'dist', reqUrl);
    }
    // Fallback to index.html for SPA routes
    if (!fs.existsSync(filePath)) {
      filePath = path.join(basePath, 'index.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(basePath, 'dist', 'index.html');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.json': 'application/json; charset=utf-8'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startLocalServer(port + 1);
    } else {
      console.error('LAN Server Error:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    lanPort = port;
    console.log(`Rose Nail Spa LAN Server running at http://${localIp}:${lanPort}/`);
  });

  httpServer = server;
}

// Create Main Window
function createWindow() {
  const iconPath = path.join(__dirname, '..', 'build', 'icon.ico');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Rose Nail Spa POS · Salon Management',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#FDF8F9',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false
    }
  });

  // Prefer dist/index.html if built, otherwise index.html
  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  const rootHtml = path.join(__dirname, '..', 'index.html');
  const targetHtml = fs.existsSync(distHtml) ? distHtml : rootHtml;

  mainWindow.loadFile(targetHtml);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Setup System Tray
  setupTray(iconPath);

  // Handle external links safely in system default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('close', (e) => {
    // Notify renderer to execute last-minute backup
    try {
      mainWindow.webContents.send('app-closing');
    } catch (_) {}
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Setup System Tray
function setupTray(iconPath) {
  if (tray) return;
  try {
    const trayIcon = fs.existsSync(iconPath) ? iconPath : path.join(__dirname, '..', 'build', 'icon.png');
    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Rose Nail Spa POS',
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Mở cửa sổ chính',
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
          } else {
            createWindow();
          }
        }
      },
      {
        label: `Màn hình khách iPad: http://${localIp}:${lanPort}/#/customer`,
        click: () => {
          shell.openExternal(`http://${localIp}:${lanPort}/#/customer`);
        }
      },
      {
        label: 'Mở thư mục sao lưu dữ liệu',
        click: () => {
          const backupDir = path.join(app.getPath('documents'), 'RoseNailSpa_Backups');
          if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
          shell.openPath(backupDir);
        }
      },
      { type: 'separator' },
      {
        label: 'Thoát ứng dụng',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setToolTip('Rose Nail Spa POS');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (err) {
    console.error('Tray setup warning:', err.message);
  }
}

// IPC Handlers
ipcMain.handle('get-lan-info', async () => {
  localIp = getLocalNetworkIp();
  return {
    localIp,
    lanPort,
    customerUrl: `http://${localIp}:${lanPort}/#/customer`
  };
});

ipcMain.handle('get-printers', async () => {
  if (!mainWindow) return [];
  return await mainWindow.webContents.getPrintersAsync();
});

ipcMain.handle('print-silent', async (event, options = {}) => {
  if (!mainWindow) return { success: false, error: 'No active window' };
  const { deviceName, silent = true, printBackground = true, pageSize } = options;

  return new Promise((resolve) => {
    mainWindow.webContents.print({
      silent: silent,
      printBackground: printBackground,
      deviceName: deviceName || undefined,
      pageSize: pageSize || undefined
    }, (success, failureReason) => {
      resolve({ success, failureReason });
    });
  });
});

ipcMain.handle('save-backup', async (event, jsonContent) => {
  try {
    const backupDir = path.join(app.getPath('documents'), 'RoseNailSpa_Backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const now = new Date();
    const dStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    const tStr = `${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
    const filename = `RoseNailSpa_Backup_${dStr}_${tStr}.json`;
    const filePath = path.join(backupDir, filename);

    fs.writeFileSync(filePath, jsonContent, 'utf8');
    return { success: true, filePath, filename };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-backup-folder', async () => {
  const backupDir = path.join(app.getPath('documents'), 'RoseNailSpa_Backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  await shell.openPath(backupDir);
  return { success: true, path: backupDir };
});

ipcMain.handle('open-external', async (event, url) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    await shell.openExternal(url);
    return { success: true };
  }
  return { success: false };
});

// App Lifecycle
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  startLocalServer(5000);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (httpServer) {
      httpServer.close();
    }
    app.quit();
  }
});
