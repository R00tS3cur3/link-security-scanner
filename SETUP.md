# 🚀 คู่มือการติดตั้งและใช้งาน Link Security Scanner

## 📦 ขั้นตอนการติดตั้ง

### 1️⃣ ติดตั้ง Dependencies

#### Backend (Server)
\`\`\`bash
cd server
npm install
\`\`\`

#### Frontend (Client)
\`\`\`bash
cd client
npm install
\`\`\`

### 2️⃣ ตั้งค่า Environment Variables

#### Server
สร้างไฟล์ `.env` ใน folder `server/`:

\`\`\`bash
cd server
cp .env.example .env
\`\`\`

แก้ไขไฟล์ `.env`:
\`\`\`env
PORT=5000
NODE_ENV=development

# **สำคัญ: ใส่ VirusTotal API Key ของคุณ**
VIRUSTOTAL_API_KEY=your_api_key_here

DB_PATH=../database/scanner.db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CACHE_TTL=86400
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
\`\`\`

#### Client (Optional)
\`\`\`bash
cd client
cp .env.example .env
\`\`\`

### 3️⃣ ดาวน์โหลด VirusTotal API Key

1. ไปที่: https://www.virustotal.com
2. สมัครสมาชิก (ฟรี)
3. Login เข้าสู่ระบบ
4. คลิกที่ Profile → API Key
5. Copy API Key
6. วางใน `server/.env`:
   \`\`\`
   VIRUSTOTAL_API_KEY=paste_your_key_here
   \`\`\`

### 4️⃣ สร้างฐานข้อมูล

\`\`\`bash
cd server
npm run init-db
\`\`\`

คุณจะเห็นข้อความ:
\`\`\`
✅ Connected to SQLite database
✅ Table scan_history created/verified
✅ Table dangerous_urls created/verified
✅ All indexes created/verified
✅ Database initialization complete!
\`\`\`

### 5️⃣ รัน Backend Server

#### Development Mode (แนะนำ)
\`\`\`bash
cd server
npm run dev
\`\`\`

#### Production Mode
\`\`\`bash
cd server
npm start
\`\`\`

Server จะรันที่: `http://localhost:5000`

### 6️⃣ รัน Frontend Client

เปิด Terminal ใหม่:

\`\`\`bash
cd client
npm run dev
\`\`\`

Client จะรันที่: `http://localhost:5173`

---

## 🎯 ทดสอบระบบ

### ✅ Test 1: ตรวจสอบ Backend
เปิดเบราว์เซอร์ไปที่: http://localhost:5000

ควรเห็น:
\`\`\`json
{
  "message": "Link Security Scanner API",
  "version": "1.0.0",
  ...
}
\`\`\`

### ✅ Test 2: ตรวจสอบ Frontend
เปิดเบราว์เซอร์ไปที่: http://localhost:5173

ควรเห็นหน้าเว็บ Link Security Scanner

### ✅ Test 3: ทดสอบสแกน URL
1. ใส่ URL: `https://google.com`
2. คลิก "สแกนตอนนี้"
3. รอสักครู่ (20-30 วินาที)
4. จะแสดงผลการสแกน

---

## 🐛 แก้ไขปัญหา

### ❌ Error: "Invalid VirusTotal API key"
**สาเหตุ:** API Key ไม่ถูกต้องหรือไม่ได้ใส่

**แก้ไข:**
1. ตรวจสอบ `server/.env`
2. ตรวจสอบว่า API Key ถูกต้อง
3. Restart server

### ❌ Error: "Rate limit exceeded"
**สาเหตุ:** VirusTotal Free tier จำกัด 4 requests/minute

**แก้ไข:**
- รอ 15 วินาที แล้วลองใหม่
- หรือใช้ Paid plan

### ❌ Error: "Database locked"
**สาเหตุ:** SQLite ถูกล็อค

**แก้ไข:**
\`\`\`bash
rm database/scanner.db
cd server
npm run init-db
\`\`\`

### ❌ Error: "Cannot connect to server"
**สาเหตุ:** Backend ไม่ทำงาน

**แก้ไข:**
1. ตรวจสอบว่า Backend รันอยู่ที่ port 5000
2. ตรวจสอบ Console logs
3. Restart server

### ❌ Error: CORS
**สาเหตุ:** Frontend ต่อ Backend ไม่ได้

**แก้ไข:**
ตรวจสอบ `server/.env`:
\`\`\`
ALLOWED_ORIGINS=http://localhost:5173
\`\`\`

---

## 📝 คำแนะนำการใช้งาน

### สแกน URL
1. ใส่ URL ในช่อง input (ไม่ต้องใส่ https://)
2. ระบบจะเติม https:// ให้อัตโนมัติ
3. คลิก "สแกนตอนนี้"
4. รอผลการสแกน

### ลิงก์ย่อ
- ระบบจะตรวจจับลิงก์ย่อ (bit.ly, tinyurl, etc.) อัตโนมัติ
- แสดง URL จริงที่ถูก redirect ไป
- สแกน URL ปลายทาง ไม่ใช่ลิงก์ย่อ

### ประวัติการสแกน
- แสดงประวัติแยกตาม IP ของคุณ
- กรองได้ 3 แบบ: ทั้งหมด / อันตราย / ปลอดภัย
- ลบประวัติได้

### URL อันตราย
- แสดง Top 10 URL ที่ถูกรายงานบ่อยสุด
- อัพเดทแบบ real-time

---

## 🔧 การพัฒนาต่อ

### เพิ่ม Features
- แก้ไขไฟล์ใน `client/src/components/`
- เพิ่ม API endpoints ใน `server/src/routes/`

### แก้ไข UI
- แก้ไข TailwindCSS ใน `client/src/styles/index.css`
- แก้ไข theme ใน `client/tailwind.config.js`

### Database Schema
- แก้ไข schema ใน `server/src/database/init.js`
- ลบ database เดิม แล้ว run `npm run init-db` ใหม่

---

## 📊 API Limits

### VirusTotal Free Tier
- 500 requests/day
- 4 requests/minute
- ต้องรอ 15 วินาทีระหว่างการสแกน

### Rate Limiting ของระบบ
- Scan endpoint: 10 requests/minute
- General: 100 requests/minute

---

## 🎨 UI Theme

- **สีหลัก:** Neon Green (#00ff88)
- **สีเตือน:** Orange (#ffaa00)
- **สีอันตราย:** Red (#ff0055)
- **Background:** Dark Blue (#0a0e27)
- **ฟอนต์:** Monospace

---

## 📞 Support

หากพบปัญหา:
1. ตรวจสอบ Console logs (F12 → Console)
2. ตรวจสอบ Terminal ที่รัน Server
3. ลองแก้ไขตามคู่มือแก้ไขปัญหาด้านบน

---

**สนุกกับการใช้งาน Link Security Scanner! 🚀**
