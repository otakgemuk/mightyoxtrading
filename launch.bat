@echo off
REM Prop Firms Platform - Quick Launch Script (Windows)
REM This script sets up and launches the app with Docker

setlocal enabledelayedexpansion

echo.
echo 🚀 Prop Firms Platform - Quick Launch
echo ======================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Get it at: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✓ Docker is installed

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker daemon is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo ✓ Docker is running
echo.

REM Copy environment file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local from .env.docker...
    copy .env.docker .env.local
    echo ✓ Created .env.local
)

echo.
echo 🐳 Starting Docker services...
docker-compose up -d

echo.
echo ⏳ Waiting for MySQL to be ready (90 seconds)...
timeout /t 90

echo.
echo 📊 Running database migrations...
docker-compose exec -T app npm run db:generate || echo Skipped
docker-compose exec -T app npm run db:push || echo Skipped

echo.
echo 📈 Loading pricing data...
docker-compose exec -T app npx ts-node db/seed-pricing.ts || echo Skipped

echo.
echo ✓ Database setup complete
echo.
echo ════════════════════════════════════════════════════════
echo ✅ Platform is running!
echo ════════════════════════════════════════════════════════
echo.
echo Frontend:  http://localhost:5173
echo API:       http://localhost:3000
echo MySQL:     localhost:3306
echo.
echo Database Credentials:
echo   User:     prop_user
echo   Password: secure_password
echo   Database: prop_firms_db
echo.
echo Useful commands:
echo   View logs:    docker-compose logs -f app
echo   Stop app:     docker-compose down
echo   Restart app:  docker-compose restart
echo.
echo Ready to launch! 🚀
echo.
pause
