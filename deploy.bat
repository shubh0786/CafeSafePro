@echo off
chcp 65001 >nul
echo ============================================
echo  In Control - Deployment Helper
echo ============================================
echo.

:: Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: Please run this from the CafeSafePro directory!
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Step 1: Checking Git configuration...
git config user.email >nul 2>&1
if errorlevel 1 (
    echo Setting up Git user...
    git config user.email "admin@cafecentral.co.nz"
    git config user.name "CafeSafe Admin"
)

echo.
echo Step 2: Adding files to Git...
git add .

echo.
echo Step 3: Committing changes...
git commit -m "Ready for deployment - %date% %time%"
if errorlevel 1 (
    echo No changes to commit or already committed.
)

echo.
echo ============================================
echo  MANUAL STEPS REQUIRED:
echo ============================================
echo.
echo 1. Push to GitHub:
echo    - Go to https://github.com/new
echo    - Create repository named: CafeSafePro
echo    - Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/CafeSafePro.git
echo    git branch -M main
echo    git push -u origin main

echo.
echo 2. Setup Database (Railway):
echo    - Go to https://railway.app/
echo    - New Project ^> Provision PostgreSQL

echo.
echo 3. Deploy (Vercel):
echo    - Go to https://vercel.com/
echo    - Import your GitHub repo

echo.
echo ============================================
pause
