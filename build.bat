@echo off
REM Docker Build and Deploy Script for Magazine Frontend (Windows)

setlocal enabledelayedexpansion

echo ============================================
echo  EVPLUG Magazine - Docker Build Script
echo ============================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found. Creating from .env.example...
    if exist "Magz-master\.env.example" (
        copy "Magz-master\.env.example" ".env"
        echo [OK] Created .env file. Please update it with your credentials.
        echo.
        echo Required variables:
        echo   - STRAPI_API_URL
        echo   - STRAPI_API_TOKEN
        echo.
        pause
    ) else (
        echo [ERROR] .env.example not found!
        exit /b 1
    )
)

echo [OK] Configuration file found
echo.

REM Build options
echo Select build option:
echo   1) Build only
echo   2) Build and run
echo   3) Build and run with docker-compose
echo   4) Stop and remove containers
set /p option="Enter option (1-4): "

set IMAGE_NAME=evplug-magazine
set IMAGE_TAG=latest
set CONTAINER_NAME=evplug-magazine

if "%option%"=="1" (
    echo.
    echo [BUILD] Building Docker image...
    docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
    if errorlevel 1 (
        echo [ERROR] Build failed!
        exit /b 1
    )
    echo [OK] Build complete!
    echo Image: %IMAGE_NAME%:%IMAGE_TAG%
    
) else if "%option%"=="2" (
    echo.
    echo [BUILD] Building Docker image...
    docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
    if errorlevel 1 (
        echo [ERROR] Build failed!
        exit /b 1
    )
    
    echo [RUN] Starting container...
    
    REM Stop and remove existing container
    docker stop %CONTAINER_NAME% 2>nul
    docker rm %CONTAINER_NAME% 2>nul
    
    REM Run new container
    docker run -d --name %CONTAINER_NAME% -p 8080:80 --restart unless-stopped --env-file .env %IMAGE_NAME%:%IMAGE_TAG%
    if errorlevel 1 (
        echo [ERROR] Failed to start container!
        exit /b 1
    )
    
    echo [OK] Container started!
    echo Access your magazine at: http://localhost:8080
    echo.
    echo View logs with: docker logs -f %CONTAINER_NAME%
    
) else if "%option%"=="3" (
    echo.
    echo [BUILD] Building with docker-compose...
    docker-compose up -d --build
    if errorlevel 1 (
        echo [ERROR] Docker compose failed!
        exit /b 1
    )
    
    echo [OK] Services started!
    echo Access your magazine at: http://localhost:8080
    echo.
    echo View logs with: docker-compose logs -f magazine-frontend
    
) else if "%option%"=="4" (
    echo.
    echo [STOP] Stopping containers...
    docker-compose down 2>nul
    docker stop %CONTAINER_NAME% 2>nul
    docker rm %CONTAINER_NAME% 2>nul
    echo [OK] Containers stopped and removed
    
) else (
    echo [ERROR] Invalid option
    exit /b 1
)

echo.
echo [DONE] Script completed successfully!
pause
