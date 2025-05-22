const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("torrentFuncts", {
    openFolder: () => {
        try {
            return ipcRenderer.invoke("open-folder")
        } catch(err) {
            console.error("Preload openFolder error: ", err);
            throw err;
        }
    },
    downloadTorrent: (magnetURI, folderPath) => {
        try {
            return ipcRenderer.invoke("download-torrent", magnetURI, folderPath);
        } catch (err) {
            console.error("Preload downloadTorrent error: ", err);
            throw err;
        }
    },
    getAllTorrents: () => {
        try {
            return ipcRenderer.invoke("get-all-torrents");
        } catch(err) {
            console.error("Preload getAllTorrents error: ", err);
            throw err;
        }
    },
    getManyDownloads: () => {
        try {
            return ipcRenderer.invoke("get-many-downloads");
        } catch(err) {
            console.error("Preload getManyDownloads error: ", err);
            throw err;
        }
    }
});
