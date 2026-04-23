#!/bin/bash

echo "🚀 Telegram Scheduler Başlatılıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend kontrolü
if [ ! -d "server/node_modules" ]; then
    echo -e "${BLUE}📦 Backend bağımlılıkları yükleniyor...${NC}"
    cd server
    npm install
    cd ..
fi

# Frontend kontrolü
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Frontend bağımlılıkları yükleniyor...${NC}"
    npm install
fi

echo ""
echo -e "${GREEN}✅ Bağımlılıklar hazır!${NC}"
echo ""

# Terminalden açılışta iki pencere açmak için
echo -e "${BLUE}🔵 Backend server başlatılıyor...${NC}"
echo ""

# Backend'i arka planda başlat
cd server
node index.js &
BACKEND_PID=$!
cd ..

# 3 saniye bekle
sleep 3

echo ""
echo -e "${BLUE}🔵 Frontend development server başlatılıyor...${NC}"
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Backend:  http://localhost:3001${NC}"
echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Ctrl+C ile her ikisini de durdurabilirsiniz"
echo ""

# Frontend'i başlat
npm run dev

# Script sonlandığında backend'i de durdur
kill $BACKEND_PID 2>/dev/null
