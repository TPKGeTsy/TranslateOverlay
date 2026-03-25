const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const screenshot = require('screenshot-desktop');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

let mainWindow;
let overlayWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('main_app.html');
  // mainWindow.webContents.openDevTools(); // สำหรับ Debug
}

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  overlayWindow = new BrowserWindow({
    width, height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false, // ซ่อนไว้ก่อนจนกว่าจะเรียกใช้
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  overlayWindow.setIgnoreMouseEvents(true);
  overlayWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createMainWindow();
  createOverlayWindow();

  // Register Shortcuts
  globalShortcut.register('Alt+Shift+Q', () => app.quit());

  globalShortcut.register('Alt+S', async () => {
    console.log('--- Scan Triggered ---');
    if (!overlayWindow) createOverlayWindow();
    
    overlayWindow.show();
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

      overlayWindow.setIgnoreMouseEvents(false);
      overlayWindow.webContents.send('process-image', { displayImg: rawPath, scanImg: processedPath });
    } catch (err) {
      console.error('Scan Error:', err);
    }
  });

  globalShortcut.register('Escape', () => {
    if (overlayWindow) {
      overlayWindow.setIgnoreMouseEvents(true);
      overlayWindow.hide();
      overlayWindow.webContents.send('cancel-scan');
    }
  });
});

// --- ระบบ Vocabulary (JSON) CRUD ---
const getVocabPath = () => path.join(app.getPath('userData'), 'vocabulary.json');

ipcMain.on('get-vocabulary', (event) => {
  const filePath = getVocabPath();
  let list = [];
  if (fs.existsSync(filePath)) {
    try {
      list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error('Read Error:', e);
    }
  }
  event.reply('update-vocab-list', list);
});

ipcMain.on('save-vocabulary', (event, wordData) => {
  const filePath = getVocabPath();
  let list = [];
  if (fs.existsSync(filePath)) {
    try { list = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e) {}
  }
  
  let existingIndex = -1;
  if (wordData.id) {
    existingIndex = list.findIndex(v => v.id === wordData.id);
  } else {
    existingIndex = list.findIndex(v => v.word.toLowerCase() === wordData.word.toLowerCase());
  }
  
  if (existingIndex > -1) {
    // อัปเดตข้อมูลเก่า
    list[existingIndex] = { ...list[existingIndex], ...wordData, date: new Date().toISOString() };
  } else {
    // สร้างใหม่ (ถ้าไม่มี ID ให้สร้างใหม่)
    const newId = wordData.id || Date.now();
    list.push({ ...wordData, id: newId, date: new Date().toISOString() });
  }
  
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  
  // ส่งกลับไปทั้ง 2 หน้าต่าง
  if (mainWindow) mainWindow.webContents.send('update-vocab-list', list);
  event.reply('update-vocab-list', list);
});

ipcMain.on('delete-vocabulary', (event, wordId) => {
  const filePath = getVocabPath();
  let list = [];
  if (fs.existsSync(filePath)) {
    list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    list = list.filter(v => v.id !== wordId);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  }
  if (mainWindow) mainWindow.webContents.send('update-vocab-list', list);
});

ipcMain.on('set-ignore-mouse', (event, ignore) => {
  if (overlayWindow) {
    overlayWindow.setIgnoreMouseEvents(ignore);
    if (ignore) overlayWindow.hide(); // ถ้า ignore คือจบการทำงาน ให้ซ่อนไปเลย
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => globalShortcut.unregisterAll());