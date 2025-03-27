const { app, screen, BrowserWindow } = require("electron");

/*
? app - create and manage electron app
? screen - get screen size to init with monitor size
? BrowserWindow - create and manage window
*/
const check=false

check()
    if(check==false){
        check==true;
    }else{
        check=true;
    }
    


const createWindow = () => {
    //? get primary monitor size
    const primaryDisplay = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: primaryDisplay.width,
        height: primaryDisplay.height,
    });
    win.loadFile("index.html");
};

//create a small window 
const createMicroWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 600,
    });
    win.loadFile("indexMicro.html");
};

//* if all windows are closed then stop the process app
app.on("window-all-closed", () => {
    app.quit();
});

//* when start app then create an windows
app.whenReady().then(() => {
    createWindow();
    ifc(check==true){
        createMicroWindow
    }
});
