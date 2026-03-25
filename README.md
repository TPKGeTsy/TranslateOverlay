# 🔍 Lexicon Master (Game Lexicon Pro)
**An AI-Powered Screen Translation & Flashcard Application for Language Learners.**

แอปพลิเคชันสำหรับแปลภาษาบนหน้าจอเกมแบบ Real-time พร้อมระบบจัดการคลังคำศัพท์และฟีเจอร์ช่วยจำ (Flashcards & Quiz) เพื่อช่วยให้การเรียนรู้ภาษาผ่านการเล่นเกมหรือท่องเว็บไซต์เป็นไปอย่างมีประสิทธิภาพ

---

## 🚀 Key Features

### 1. 🖥️ Screen Translation Overlay (Function)
- **Instant Scan:** กด `Alt + S` เพื่อแคปหน้าจอและสแกนข้อความด้วย **OCR (Tesseract.js)** ทันที
- **Auto-Translate:** ระบบแปลภาษาอัตโนมัติ (English -> Thai) พร้อมนิยามภาษาอังกฤษประกอบ
- **Quick Save:** ปุ่ม "เก็บเข้าคลังคำศัพท์" เพื่อบันทึกคำที่สแกนลงในแอปหลักอัตโนมัติ

### 2. 📚 Vocabulary Management (Main App)
- **Dashboard:** สรุปสถิติจำนวนคำศัพท์ทั้งหมดและคำศัพท์ใหม่รายวัน
- **My Library:** จัดการคลังคำศัพท์ส่วนตัว สามารถ **เพิ่ม (Add)**, **แก้ไข (Edit)** และ **ลบ (Delete)** ข้อมูลได้ตามต้องการ
- **Search:** ระบบค้นหาคำศัพท์ที่รวดเร็ว

### 3. 🧠 Learning & Practice
- **Flashcards:** โหมดท่องจำแบบการ์ดสไตล์ Minimal พลิกดูคำแปลได้ พร้อมระบบสลับลำดับ (Shuffle)
- **Interactive Quiz:** ทดสอบความจำด้วยการพิมพ์คำแปลให้ถูกต้อง พร้อมระบบ Feedback ทันที

---

## 🛠️ Tech Stack
- **Frontend:** Electron.js, Tailwind CSS (Main App UI)
- **OCR Engine:** Tesseract.js
- **Image Processing:** Sharp.js (High-performance Node.js image processing)
- **Data Storage:** JSON-based local persistence
- **APIs:** MyMemory Translation API & Google Dictionary API

---

## ⌨️ Shortcuts
| Shortcut | Action |
| --- | --- |
| `Alt + S` | **Trigger Scan:** เริ่มต้นการสแกนหน้าจอ (Overlay Mode) |
| `Escape` | **Cancel Scan:** ปิดหน้าจอ Overlay และกลับสู่หน้าแอปหลัก |
| `Alt + Shift + Q` | **Quit:** ปิดโปรแกรมทันที |

---

## 📦 Installation & Development
หากต้องการนำไปพัฒนาต่อหรือ Build เอง:

1. Clone repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/TranslateOverlay.git]
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development:
   ```bash
   npm start
   ```
4. Build as Portable App (.exe):
   ```bash
   npm run dist
   ```

---

## 📝 License
MIT License - Developed for Educational & Gaming purposes.
