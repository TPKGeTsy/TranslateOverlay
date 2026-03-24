const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const screenshot = require('screenshot-desktop');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

let win;

function createOverlay() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  win = new BrowserWindow({
    width, height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  win.setIgnoreMouseEvents(true);
  win.loadFile('index.html');

  // จดทะเบียนปุ่มลัดเมื่อ Ready
  globalShortcut.register('Alt+Shift+Q', () => app.quit());

  globalShortcut.register('Alt+S', async () => {
    console.log('--- Scan Triggered ---');
    const userDataPath = app.getPath('userData');
    const rawPath = path.join(userDataPath, 'raw_shot.png');
    const processedPath = path.join(userDataPath, 'processed_shot.png');

    try {
      await screenshot({ filename: rawPath });
      await sharp(rawPath)
        .resize({ width: 5760 }) // 3x Zoom
        .greyscale()
        .normalize()
        .sharpen()
        .threshold(180)
        .toFile(processedPath);

      win.setIgnoreMouseEvents(false);
      win.webContents.send('process-image', { displayImg: rawPath, scanImg: processedPath });
    } catch (err) {
      console.error('Scan Error:', err);
    }
  });

  globalShortcut.register('Escape', () => {
    win.setIgnoreMouseEvents(true);
    win.webContents.send('cancel-scan');
  });
}

app.whenReady().then(createOverlay);

// --- ระบบ Vocabulary (JSON) ---
ipcMain.on('save-vocabulary', (event, wordData) => {
  const filePath = path.join(app.getPath('userData'), 'vocabulary.json');
  let list = [];
  if (fs.existsSync(filePath)) {
    try { list = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e) {}
  }
  // เช็กคำซ้ำ
  if (!list.find(v => v.word.toLowerCase() === wordData.word.toLowerCase())) {
    list.push({ ...wordData, date: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  }
  event.reply('update-vocab-list', list);
});

ipcMain.on('get-vocabulary', (event) => {
  const filePath = path.join(app.getPath('userData'), 'vocabulary.json');
  if (fs.existsSync(filePath)) {
    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    event.reply('update-vocab-list', list);
  }
});

ipcMain.on('set-ignore-mouse', (event, ignore) => {
  if (win) win.setIgnoreMouseEvents(ignore);
});

app.on('will-quit', () => globalShortcut.unregisterAll());