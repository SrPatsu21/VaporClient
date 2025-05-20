const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: () => ipcRenderer.invoke('open-folder-dialog'),
  downloadTorrent: (magnetURI, folderPath) =>
    ipcRenderer.invoke('download-torrent', magnetURI, folderPath)
});
