const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");
const path = require("path");
const { join } = require("path");

// const WebTorrent = (await import("webtorrent")).default;
// global.client = new WebTorrent();
let client;

async function getClient() {
    const WebTorrent = (await import("webtorrent")).default;
    if (!client) {
        client = new WebTorrent();
    }
    return client;
}

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay().workAreaSize;
    const mainWindow = new BrowserWindow({
        width: primaryDisplay.width,
        height: primaryDisplay.height,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "../preload/index.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.webContents.openDevTools({ mode: "right" }); // DEV ONLY

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    } else {
        mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }
}

app.whenReady().then(createWindow);

// IPC for folder dialog
ipcMain.handle("open-folder", async () => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });
        return result.canceled ? null : result.filePaths[0];
    } catch (err) {
        console.error("open-folder error: ", err);
        throw err;
    }
});

// IPC for downloading torrent
ipcMain.handle("download-torrent", async (event, magnetURI, folderPath) => {
    try {
        const tempClient = await getClient();
        tempClient.add(magnetURI, { path: folderPath }, (torrent) => {
            torrent.on("done", () => {
                console.log("Download finished!");
            });

            torrent.on("error", (err) => {
                console.error("Torrent error:", err);
            });
        });
    } catch (err) {
        console.error("download-torrent error: ", err);
        throw err;
    }
});

// IPC for download status
ipcMain.handle("get-all-torrents", async () => {
    try {
        if (client && client.torrents) {
            return client.torrents.map(torrent => ({
                name: torrent.name,
                timeRemaining: (torrent.timeRemaining / 100000).toFixed(2), // ms to m
                progress: torrent.progress,
                downloaded: (torrent.downloaded / 1000000000).toFixed(2), // B to GB
                downloadSpeed: (torrent.downloadSpeed / 1000000).toFixed(2), // B to MB
                uploadSpeed: (torrent.uploadSpeed / 1000000).toFixed(2), // B to MB
                done: torrent.done,
                numPeers: torrent.numPeers,
                length: (torrent.length / 1000000000).toFixed(2), // B to GB
              }));
        }
        return [];
    } catch (err) {
        console.error("get-all-torrents error: ", err);
        throw err;
    }
});

// IPC for footer download count
ipcMain.handle("get-many-downloads", async () => {
    try {
        if (client && client.torrents) {
            let count = 0;
            client.torrents.map(( torrent ), () => {
                if (!torrent.ready) count++;
            })
            console.log("count = ", count)
            return count;
        }
        return 0;
    } catch(err) {
        console.error("get-many-downloads error: ", err);
        throw err;
    }
})