# 🔒 Link Security Scanner

ระบบตรวจสอบความปลอดภัยของ URL ก่อนเข้าใช้งาน พร้อม UI แบบ Cybersecurity Theme

## ✨ Features

- 🔍 **URL Scanning** - สแกน URL ด้วย VirusTotal API
- 🔗 **URL Unshortening** - ตรวจจับและแก้ลิงก์ย่อ (bit.ly, tinyurl, etc.)
- 📊 **Security Gauge** - แสดงคะแนนความปลอดภัยแบบ visual
- 🌍 **IP Geolocation** - แสดงตำแหน่งที่ตั้งของเซิร์ฟเวอร์
- 📝 **WHOIS Info** - ข้อมูลโดเมนและอายุ
- 💾 **Scan History** - เก็บประวัติการสแกนแยกตาม IP
- 🚨 **Threat Database** - ฐานข้อมูล URL อันตรายรวม
- 🎨 **Cyber UI** - ธีม Hacker/Cybersecurity พร้อม Matrix animation

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- SQLite3
- VirusTotal API v3
- Node-Cache
- Axios

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion
- react-gauge-component

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- VirusTotal API Key (ฟรี)

## 🚀 Quick Start

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd link-security-scanner
\`\`\`

### 2. Setup Backend

\`\`\`bash
cd server
npm install

# สร้าง .env file
cp .env.example .env

# แก้ไข .env ใส่ VirusTotal API Key
# VIRUSTOTAL_API_KEY=your_api_key_here

# Initialize database
npm run init-db

# Start server
npm run dev
\`\`\`

Server จะรันที่ `http://localhost:5000`

### 3. Setup Frontend

\`\`\`bash
cd client
npm install

# สร้าง .env file (optional)
cp .env.example .env

# Start dev server
npm run dev
\`\`\`

Client จะรันที่ `http://localhost:5173`

## 🔑 Get VirusTotal API Key

1. ไปที่ https://www.virustotal.com
2. Sign up / Login
3. ไปที่ Profile → API Key
4. Copy API Key ใส่ใน `server/.env`

## 📁 Project Structure

\`\`\`
link-security-scanner/
├── server/           # Backend API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── middleware/
│   └── package.json
│
├── client/           # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
│
└── database/         # SQLite database
\`\`\`

## 🔌 API Endpoints

### Scan
- `POST /api/scan` - สแกน URL

### History
- `GET /api/history` - ดึงประวัติทั้งหมด
- `GET /api/history/dangerous` - ดึงประวัติอันตราย
- `GET /api/history/safe` - ดึงประวัติปลอดภัย
- `DELETE /api/history` - ลบประวัติทั้งหมด

### Threats
- `GET /api/threats/top10` - Top 10 URL อันตราย
- `GET /api/threats` - URL อันตรายทั้งหมด

## 🎯 How It Works

1. ผู้ใช้ใส่ URL
2. ระบบตรวจสอบและแก้ลิงก์ย่อ (ถ้ามี)
3. ส่งไปสแกนกับ VirusTotal API
4. คำนวณคะแนนความปลอดภัย
5. ดึงข้อมูล Geolocation และ WHOIS
6. บันทึกประวัติลง SQLite
7. แสดงผลลัพธ์พร้อม gauge และ animation

## ⚙️ Configuration

### Rate Limiting
- Scan: 10 requests/minute
- General: 100 requests/minute

### Cache
- TTL: 24 hours
- เก็บผลลัพธ์ URL ที่เคยสแกน

### Database
- Auto-cleanup: เก็บประวัติ 30 วัน

## 🐛 Troubleshooting

### VirusTotal Rate Limit
- Free tier: 500 requests/day, 4 requests/minute
- รอ 15 วินาทีระหว่างการสแกน

### Database Locked
\`\`\`bash
rm database/scanner.db
npm run init-db
\`\`\`

### CORS Error
ตรวจสอบ `ALLOWED_ORIGINS` ใน `server/.env`

## 📝 License

MIT

## 👨‍💻 Author

Your Name

## 🙏 Credits

- VirusTotal API
- ipapi.co
- React Gauge Component
