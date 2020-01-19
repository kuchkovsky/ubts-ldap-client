const { app, BrowserWindow } = require('electron');
const path = require('path');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

let window;

app.on('ready', () => {
  window = new BrowserWindow({
    width: 800,
    height: 820,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadFile(`${__dirname}/app/index.html`);
});

app.on('window-all-closed', () => {
  app.quit();
});
