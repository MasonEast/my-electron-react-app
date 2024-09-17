const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 可选的预加载脚本
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  win.loadURL('http://localhost:3000'); // React 应用的地址
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Text files', extensions: ['txt', 'md'] }]
    })
    if(canceled){
        return {canceled: true}
    } else {
        const filePath = filePaths[0];
        const content = await fs.readFile(filePath, 'utf-8');
        return {canceled: false, content, filePath}
    }
})