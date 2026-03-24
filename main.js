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
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // กลับมาใช้แบบง่ายเพื่อให้รันผ่าน
      webSecurity: false       // อนุญาตให้โหลดรูปในเครื่องตรงๆ
    }
  });

  win.setIgnoreMouseEvents(true);
  win.loadFile('index.html');

  // ถ้าต้องการ Debug ให้แก้คอมเมนต์บรรทัดล่างครับ
  // win.webContents.openDevTools({ mode: 'detach' });

  globalShortcut.register('Alt+S', async () => {
    console.log('--- Scanning Started ---');
    const userDataPath = app.getPath('userData');
    const rawPath = path.join(userDataPath, 'raw_shot.png');
    const processedPath = path.join(userDataPath, 'processed_shot.png');

    try {
      await screenshot({ filename: rawPath });

      // สูตรใหม่: ขยาย 3 เท่า + Normalize + Sharpen เพื่อความคมชัดสูงสุด
      await sharp(rawPath)
        .resize({ width: 5760 }) // 3x ของ 1920 เพื่อให้ตัวหนังสือใหญ่และชัด
        .greyscale()
        .normalize() // ปรับค่าสีให้สมดุล (ทำให้ตัวหนังสือดำ/ขาวชัดขึ้น)
        .sharpen()   // เน้นขอบตัวหนังสือ
        .threshold(180) // ตัด Noise พื้นหลัง (ปรับเป็น 180 เพื่อให้ตัวหนังสือหนาขึ้น)
        .toFile(processedPath);

      win.setIgnoreMouseEvents(false);
      win.webContents.send('process-image', {
        displayImg: rawPath,
        scanImg: processedPath
      });
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

// ระบบเซฟคำศัพท์ลงไฟล์
ipcMain.on('save-vocabulary', (event, wordData) => {
  const filePath = path.join(app.getPath('userData'), 'vocabulary.json');
  let vocabList = [];

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    vocabList = JSON.parse(content);
  }

  if (!vocabList.find(v => v.word.toLowerCase() === wordData.word.toLowerCase())) {
    vocabList.push({ ...wordData, date: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(vocabList, null, 2));
  }
  
  // ส่งลิสต์ที่อัปเดตกลับไปให้ UI
  event.reply('update-vocab-list', vocabList);
});

// ดึงลิสต์ตอนเปิด Library
ipcMain.on('get-vocabulary', (event) => {
  const filePath = path.join(app.getPath('userData'), 'vocabulary.json');
  if (fs.existsSync(filePath)) {
    const vocabList = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    event.reply('update-vocab-list', vocabList);
  }
});

ipcMain.on('get-user-data-path', (event) => {
  event.returnValue = app.getPath('userData');
});

ipcMain.on('set-ignore-mouse', (event, ignore) => {
  if (win) win.setIgnoreMouseEvents(ignore);
});

app.on('will-quit', () => globalShortcut.unregisterAll());
