const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  getLanInfo: () => ipcRenderer.invoke('get-lan-info'),
  printSilent: (options) => ipcRenderer.invoke('print-silent', options),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  saveBackup: (jsonContent) => ipcRenderer.invoke('save-backup', jsonContent),
  openBackupFolder: () => ipcRenderer.invoke('open-backup-folder'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  onAppClosing: (callback) => {
    ipcRenderer.on('app-closing', () => callback());
  },
  sendBackupOnClose: (data) => ipcRenderer.send('backup-on-close-data', data)
});
