const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Arecofix Desktop',
    icon: path.join(__dirname, '../dist/arecofix/browser/assets/img/brands/logo/Logo.ico')
  });

  // Load the index.html from the dist folder
  const startUrl = url.format({
    pathname: path.join(__dirname, '../dist/arecofix/browser/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
