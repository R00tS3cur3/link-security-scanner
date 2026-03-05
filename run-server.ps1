# Link Security Scanner - Startup Script (Server)

Write-Host "Starting Link Security Scanner - Backend Server" -ForegroundColor Green
Write-Host ""

# Set Node.js PATH
$env:Path = "C:\Program Files\nodejs;" + $env:Path

# Go to server folder
Set-Location -Path "$PSScriptRoot\server"

# Check if PM2 is installed
$pm2Installed = Get-Command pm2 -ErrorAction SilentlyContinue

if ($pm2Installed) {
    Write-Host "Using PM2 for process management" -ForegroundColor Cyan
    
    # Stop old process (if any)
    pm2 delete scanner-api 2>$null
    
    # Start server with PM2
    pm2 start npm --name "scanner-api" -- run dev
    
    Write-Host ""
    Write-Host "Server Status:" -ForegroundColor Yellow
    pm2 status
    
    Write-Host ""
    Write-Host "Useful PM2 Commands:" -ForegroundColor Cyan
    Write-Host "  pm2 logs scanner-api    - view logs"
    Write-Host "  pm2 restart scanner-api - restart"
    Write-Host "  pm2 stop scanner-api    - stop"
    Write-Host "  pm2 monit               - view CPU/Memory"
} else {
    Write-Host "PM2 not found, using npm directly" -ForegroundColor Yellow
    Write-Host "  Install PM2 for better stability: npm install -g pm2" -ForegroundColor Gray
    Write-Host ""
    npm run dev
}

Write-Host ""
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Green
