const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const chardet = require('chardet');
const iconv = require('iconv-lite');

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

// 处理打开文件事件
ipcMain.handle('open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Text files', extensions: ['txt', 'md'] }]
    })
    if(canceled){
        return {canceled: true}
    } else {
        const filePath = filePaths[0];
        const encoding = chardet.detectFileSync(filePath); // 检测文件的实际编码
        const buffer = fs.readFileSync(filePath);
        const content = iconv.decode(buffer, encoding); // 用正确的编码读取文件内容，从而避免出现乱码问题

        return {canceled: false, content, filePath}
    }
})