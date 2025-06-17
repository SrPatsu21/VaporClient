const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");
const path = require("path");
const { join } = require("path");
const fs = require("fs");

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

async function readTorrentDataFile() {
    // open ongoing torrents
    try {
        const dataTorrents = JSON.parse(
            fs.readFileSync(
                path.join(
                    app.getPath("userData"),
                    "torrents-download-ongoing.json"
                ),
                "utf8"
            )
        );
        if (0 != dataTorrents.length) {
            const Client = await getClient();
            dataTorrents.forEach((torrent) => {
                Client.add(torrent.magnetURI, torrent.path, (torrent) => {
                    console.log("torrent add");
                    torrent.on("done", () => {
                        console.log("Download finished!");
                        // torrent.destroy();
                    });

                    torrent.on("error", (err) => {
                        console.error("Torrent error:", err);
                    });
                });
            });
        }
    } catch (err) {
        console.log("open dataTorrents file error: ", err);
    }
}

app.whenReady().then(async () => {
    createWindow();
    await readTorrentDataFile();
});

app.on("window-all-closed", () => {
    // save new torrents
    let dataTorrents = [];
    if (client && client.torrents) {
        dataTorrents = client.torrents.map((torrent) => ({
            magnetURI: torrent.magnetURI,
            path: torrent.path,
        }));
    }
    console.log("start saving file");
    const filePath = path.join(
        app.getPath("userData"),
        "torrents-download-ongoing.json"
    );
    const data = JSON.stringify(dataTorrents);
    try {
        fs.writeFileSync(filePath, data, "utf-8");
        console.log("File saved");
    } catch (err) {
        console.error("Failed to save torrents:", err);
    }


    // TODO: destroy client

    console.log("window all closed");
    if (process.platform !== "darwin") {
        app.quit(); // This is okay if 'before-quit' handles everything
    }
});

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
            console.log("torrent add");
            torrent.on("done", () => {
                console.log("Download finished!");
                // torrent.destroy();
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
            return client.torrents.map((torrent) => ({
                name: torrent.name,
                done: torrent.done,
                magnetURI: torrent.magnetURI,
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
            console.log(client.torrents);
            client.torrents.map(torrent => {
                if (!torrent.done) count++;
            });
            return count;
        }
        return 0;
    } catch (err) {
        console.error("get-many-downloads error: ", err);
        throw err;
    }
});

// IPC for destroy torrents when download/upload on download screen
ipcMain.handle("destroy-torrent", async (event, torrentID) => {
    try {
        if (client && client.torrents) {
            const torrentName = (await client.get(torrentID)).name;
            client.remove(torrentID);
            console.log("Destroy torrent ", torrentName)
            return `${torrentName} remove with success!`;
            // return JSON.stringify({ message: `${torrentName} removed with success!`});
        }
    } catch (err) {
        console.error("destroy-torrent error: ", err);
        throw err;
    }
});

// IPC for test
ipcMain.handle("get-single-torrent", async (event, torrentID) => {
    try {
        if (client && client.torrents) {
            console.log(await client.get(torrentID));
            return await client.get(torrentID);
        }
        return [];
    } catch (err) {
        console.error("get-single-torrent error: ", err);
        throw err;
    }
});
