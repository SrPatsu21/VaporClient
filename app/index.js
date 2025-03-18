const { app, screen, BrowserWindow } = require("electron");

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    console.log(primaryDisplay.workAreaSize);
    const win = new BrowserWindow({
        width: primaryDisplay.workAreaSize.width,
        height: primaryDisplay.workAreaSize.height,
    });

    win.loadFile("index.html");
};

//* if all windows are closed then close the process app
//? windows and linux - FUNCIONALITY
if (process.platform !== "darwin") {
    app.on("window-all-closed", () => {
        app.quit();
    });
}

//* when start app then create an windows
app.whenReady().then(() => {
    createWindow();

    //? macos - FUNCIONALITY
    if (process.platform == "darwin") {
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    }
});
