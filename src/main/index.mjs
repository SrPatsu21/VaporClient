const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { join } = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(createWindow);

// IPC for folder dialog
ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

// ✅ IPC for downloading torrent
ipcMain.handle('download-torrent', async (event, magnetURI, folderPath) => {
  const WebTorrent = (await import('webtorrent')).default; // ✅ dynamic import for ESM
  const client = new WebTorrent();

  client.add(magnetURI, { path: folderPath }, (torrent) => {
    console.log(`Downloading: ${torrent.name}`);

    torrent.on('done', () => {
      console.log('Download finished!');
    });

    torrent.on('error', err => {
      console.error('Torrent error:', err);
    });
  });
});
