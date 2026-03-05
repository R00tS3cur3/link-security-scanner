# Link Security Scanner - Startup Script (Client)

Write-Host "🎨 Starting Link Security Scanner - Frontend" -ForegroundColor Green
Write-Host ""

# ตั้งค่า Node.js PATH
$env:Path = "C:\Program Files\nodejs;" + $env:Path

# ไปที่โฟลเดอร์ client
Set-Location -Path "$PSScriptRoot\client"

Write-Host "Starting Vite development server..." -ForegroundColor Cyan
npm run dev

Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Green
