# 🔍 TranslateOverlay (Game Lexicon Pro)
**An AI-Powered Screen Translation Overlay for Gamers.**

แอปพลิเคชันสำหรับแปลภาษาบนหน้าจอเกมแบบ Real-time โดยใช้เทคนิค **OCR (Tesseract.js)** และ **Image Processing (Sharp)** เพื่อช่วยให้การเล่นเกมภาษาต่างประเทศลื่นไหลขึ้น ไม่ต้องสลับหน้าจอไปพิมพ์ศัพท์เอง

---

## 🚀 Key Features
- **Instant Scan:** กด `Alt + S` เพื่อแคปหน้าจอและสแกนข้อความทันที
- **Auto-Translate:** ระบบตรวจจับการพิมพ์และแปลภาษาอัตโนมัติภายใน 0.5 วินาที
- **Thai Context:** แสดงคำแปลไทยพร้อมคำอธิบายความหมายที่หลากหลาย
- **Vocabulary Library:** เซฟคำศัพท์ที่สนใจลงในคลังส่วนตัวอัตโนมัติ (JSON format)
- **HUD Design:** อินเตอร์เฟซสไตล์โปร่งแสง (Glassmorphism) ไม่บังหน้าจอเกม
- **Portable App:** Build เป็นไฟล์ `.exe` พร้อมใช้งานได้ทันทีไม่ต้องติดตั้ง

---

## 🛠️ Tech Stack
- **Framework:** Electron.js
- **OCR Engine:** Tesseract.js
- **Image Processing:** Sharp.js (High-performance Node.js image processing)
- **APIs:** MyMemory Translation API & Google Dictionary API

---

## 📦 Installation & Build
หากต้องการนำไปพัฒนาต่อหรือ Build เอง:

1. Clone repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/TranslateOverlay.git](https://github.com/YOUR_USERNAME/TranslateOverlay.git)