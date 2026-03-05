# 🚀 Deployment Guide - Link Security Scanner

## เลือกวิธี Deploy

มี 2 วิธีหลัก:
1. **Deploy ขึ้น Cloud** (แนะนำ) - อาจารย์เปิดลิงก์ดูได้เลย
2. **ส่งโค้ดให้อาจารย์รันเอง** - ต้องติดตั้ง Node.js

---

## 🌐 วิธีที่ 1: Deploy ขึ้น Cloud (ฟรี!)

### A. Deploy Frontend (Vercel)

**ขั้นตอน:**

1. **สร้าง GitHub Repository**
```powershell
cd c:/Users/Khawt/Downloads/project/link-security-scanner
git init
git add .
git commit -m "Initial commit"
```

2. **Push ขึ้น GitHub**
- ไปที่ https://github.com/new
- สร้าง repo ใหม่ (ชื่ออะไรก็ได้)
- ทำตามคำสั่งที่ GitHub แสดง

3. **Deploy ด้วย Vercel**
- ไปที่ https://vercel.com
- Sign in with GitHub
- Click "New Project"
- เลือก repo ที่สร้าง
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Click "Deploy"

**ผลลัพธ์:** ได้ URL แบบ `https://your-app.vercel.app`

---

### B. Deploy Backend (Railway)

**ขั้นตอน:**

1. **ไปที่ Railway**
- https://railway.app
- Sign in with GitHub

2. **Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- เลือก repo เดียวกัน
- **Root Directory:** `server`

3. **เพิ่ม Environment Variables**
```
PORT=5000
NODE_ENV=production
VIRUSTOTAL_API_KEY=8a9503709938f6ecdc712194b9e2bfffa5dca6b30f9b45c20fba09cab669668d
DB_PATH=../database/scanner.db
ALLOWED_ORIGINS=https://your-app.vercel.app
CACHE_TTL=86400
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

4. **Deploy**
- Railway จะ deploy อัตโนมัติ
- รอ 2-3 นาที

**ผลลัพธ์:** ได้ URL แบบ `https://your-api.railway.app`

---

### C. เชื่อม Frontend กับ Backend

**แก้ไข `client/src/utils/constants.js`:**
```javascript
export const API_BASE_URL = 'https://your-api.railway.app/api';
```

**Commit และ Push:**
```powershell
git add .
git commit -m "Update API URL"
git push
```

Vercel จะ deploy ใหม่อัตโนมัติ

---

## 📦 วิธีที่ 2: ส่งโค้ดให้อาจารย์รัน

### สร้าง Package

```powershell
# 1. สร้างโฟลเดอร์ใหม่
cd c:/Users/Khawt/Downloads
mkdir link-scanner-submit
cd link-scanner-submit

# 2. คัดลอกไฟล์
Copy-Item -Recurse c:/Users/Khawt/Downloads/project/link-security-scanner/* .

# 3. ลบไฟล์ไม่จำเป็น
Remove-Item -Recurse -Force node_modules, client/node_modules, server/node_modules, .git
Remove-Item -Recurse -Force .github, docs, scripts

# 4. Zip ทั้งโฟลเดอร์
Compress-Archive -Path * -DestinationPath ../link-scanner-submit.zip
```

### สร้างไฟล์ README สำหรับอาจารย์

**สร้าง `README_FOR_TEACHER.md`:**
```markdown
# Link Security Scanner

## ความต้องการ
- Node.js 18 หรือสูงกว่า (ดาวน์โหลดจาก https://nodejs.org)

## วิธีรัน

### 1. ติดตั้ง Dependencies
```powershell
# ติดตั้ง server
cd server
npm install

# ติดตั้ง client
cd ../client
npm install
```

### 2. รัน Backend (Terminal 1)
```powershell
cd server
npm run dev
```

### 3. รัน Frontend (Terminal 2)
```powershell
cd client
npm run dev
```

### 4. เปิดเบราว์เซอร์
http://localhost:5173

## ทดสอบ
ลองสแกน URL: https://www.google.com
```

**แล้ว Zip ส่งให้อาจารย์**

---

## 🎥 วิธีที่ 3: บันทึกวิดีโอ Demo (แนะนำเพิ่มเติม!)

**ใช้ OBS Studio หรือ Windows Game Bar (Win + G):**

1. เปิดแอปที่ http://localhost:5173
2. กด Win + G เพื่อเปิด Game Bar
3. กดปุ่มบันทึก
4. แสดงการทำงาน:
   - สแกน google.com
   - แสดงผลลัพธ์
   - แสดงประวัติการสแกน
   - แสดง Threat Database
5. หยุดบันทึก
6. ส่งไฟล์ MP4 ให้อาจารย์

---

## 📊 เปรียบเทียบวิธี

| วิธี | ข้อดี | ข้อเสีย | เวลา |
|------|-------|---------|------|
| **Cloud Deploy** | อาจารย์เปิดลิงก์ดูได้เลย | ต้องมี GitHub | 15-20 นาที |
| **ส่งโค้ด** | ครบถ้วน | อาจารย์ต้องติดตั้ง Node.js | 5 นาที |
| **วิดีโอ** | ง่ายที่สุด | ไม่ได้โค้ด | 5 นาที |

---

## 💡 คำแนะนำ

**แนะนำทำทั้ง 3 วิธี:**
1. Deploy ขึ้น Cloud → ส่งลิงก์ให้อาจารย์
2. Zip โค้ด → ส่งให้อาจารย์เผื่อต้องการดูโค้ด
3. บันทึกวิดีโอ → แสดงการทำงานจริง

**ส่งให้อาจารย์:**
- 📧 Email พร้อม:
  - ลิงก์แอป (ถ้า deploy)
  - ไฟล์ ZIP โค้ด
  - ไฟล์วิดีโอ
  - README อธิบายโปรเจกต์

---

ต้องการให้ผมช่วยทำขั้นตอนไหนมั้ยครับ? 😊
