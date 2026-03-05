# Quick Start — Link Security Scanner

## วิธีเปิดโปรเจค

### ขั้นตอนที่ 1 — ปิด process เก่า (ถ้ามี)
เปิด Task Manager (`Ctrl+Shift+Esc`) → หา `node.exe` → คลิกขวา → End Task ทุกตัว

---

### ขั้นตอนที่ 2 — เปิด PowerShell 2 หน้าต่าง

**หน้าต่างที่ 1 — Backend:**
```powershell
cd c:/Users/Khawt/Downloads/project/link-security-scanner/server
npm run dev
```
รอจนเห็น: `Server running on port 5000`

**หน้าต่างที่ 2 — Frontend:**
```powershell
cd c:/Users/Khawt/Downloads/project/link-security-scanner/client
npm run dev
```
รอจนเห็น: `Local: http://localhost:5173`

---

### ขั้นตอนที่ 3 — เปิดเบราว์เซอร์
```
http://localhost:5173
```

---

## หยุดโปรแกรม
กด `Ctrl+C` ในทั้ง 2 หน้าต่าง

---

## ตรวจสอบสถานะ
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:5173

---

## แก้ปัญหา Port ถูกใช้งาน (Error: EADDRINUSE)
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```
แล้วรัน Backend ใหม่
