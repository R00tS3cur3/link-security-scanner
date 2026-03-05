#!/bin/bash

echo "🔒 Link Security Scanner - Quick Start"
echo "======================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Setup Server
echo "📦 Setting up Backend Server..."
cd server

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please edit server/.env and add your VirusTotal API Key!"
fi

echo "Installing server dependencies..."
npm install

echo "Initializing database..."
npm run init-db

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup Client
echo "📦 Setting up Frontend Client..."
cd ../client

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo "Installing client dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Instructions
echo "======================================="
echo "🎯 Next Steps:"
echo "======================================="
echo ""
echo "1. Get VirusTotal API Key:"
echo "   - Go to: https://www.virustotal.com"
echo "   - Sign up (free)"
echo "   - Get API Key from Profile → API Key"
echo ""
echo "2. Edit server/.env:"
echo "   VIRUSTOTAL_API_KEY=your_api_key_here"
echo ""
echo "3. Start Backend:"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "4. Start Frontend (in new terminal):"
echo "   cd client"
echo "   npm run dev"
echo ""
echo "5. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "======================================="
echo "✨ Happy Scanning! 🚀"
echo "======================================="
