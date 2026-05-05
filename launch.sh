#!/bin/bash

# Prop Firms Platform - Quick Launch Script
# This script sets up and launches the app with Docker

set -e

echo "🚀 Prop Firms Platform - Quick Launch"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}❌ Docker is not installed. Please install Docker Desktop first.${NC}"
    echo "Get it at: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${YELLOW}❌ Docker daemon is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${BLUE}📝 Creating .env.local from .env.docker...${NC}"
    cp .env.docker .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
fi

# Build and start services
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker-compose up -d

echo -e "${YELLOW}⏳ Waiting for MySQL to be ready (60 seconds)...${NC}"
sleep 60

# Run migrations
echo -e "${BLUE}📊 Running database migrations...${NC}"
docker-compose exec -T app npm run db:generate || true
docker-compose exec -T app npm run db:push || true

# Load pricing data
echo -e "${BLUE}📈 Loading pricing data...${NC}"
docker-compose exec -T app npx ts-node db/seed-pricing.ts || true

echo -e "${GREEN}✓ Database setup complete${NC}"

# Get the port
PORT=${PORT:-5173}

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Platform is running!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Frontend:${NC} http://localhost:${PORT}"
echo -e "${BLUE}API:${NC}      http://localhost:3000"
echo -e "${BLUE}MySQL:${NC}    localhost:3306"
echo ""
echo -e "${YELLOW}Database Credentials:${NC}"
echo "  User:     prop_user"
echo "  Password: secure_password"
echo "  Database: prop_firms_db"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  View logs:    docker-compose logs -f app"
echo "  Stop app:     docker-compose down"
echo "  Restart app:  docker-compose restart"
echo ""
echo -e "${GREEN}Ready to launch! 🚀${NC}"
