const { app, BrowserWindow } = require("electron");
const path = require("path");

// Simplest way to reload an electron app on file changes, comment this require before run `npm run package-win` 
// require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// });

const remoteMain = require("@electron/remote/main");

remoteMain.initialize();

function createWindow() {
    const win = new BrowserWindow({
        // Read the Icon
        icon: "assets/Icon/millionIcon.ico",
        // Diasble the maximize the window
        maximizable: false,
        width: 1000,
        height: 800,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: false,
            worldSafeExecuteJavaScript: true,
            enableRemoteModule: true,
        },
    });

    // Load this file to become the UI
    win.loadFile("Million.html");
    remoteMain.enable(win.webContents);

    win.on("ready-to-show", () => {
        win.show();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
