@echo off
title CRS Microservices Runner
echo ========================================================
echo   DANG KHOI DONG TAT CA MICROSERVICES & FRONTEND
echo ========================================================

set "JAVA_HOME=C:\Program Files\Java\jdk-23"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/5] Khoi dong Auth Service (Port 8081)...
start "1. Auth Service [8081]" cmd /k "set "JAVA_HOME=C:\Program Files\Java\jdk-23" && cd /d "%~dp0auth-service" && mvnw.cmd spring-boot:run"
timeout /t 2 /nobreak >nul

echo [2/5] Khoi dong Course Service (Port 8085)...
start "2. Course Service [8085]" cmd /k "set "JAVA_HOME=C:\Program Files\Java\jdk-23" && cd /d "%~dp0course-service" && mvnw.cmd spring-boot:run"
timeout /t 2 /nobreak >nul

echo [3/5] Khoi dong Registration Service (Port 8083)...
start "3. Registration Service [8083]" cmd /k "set "JAVA_HOME=C:\Program Files\Java\jdk-23" && cd /d "%~dp0registration-service" && mvnw.cmd spring-boot:run"
timeout /t 2 /nobreak >nul

echo [4/5] Khoi dong API Gateway (Port 8080)...
start "4. API Gateway [8080]" cmd /k "set "JAVA_HOME=C:\Program Files\Java\jdk-23" && cd /d "%~dp0api-gateway" && mvnw.cmd spring-boot:run"
timeout /t 2 /nobreak >nul

echo [5/5] Khoi dong Frontend (Port 5173)...
start "5. CRS Frontend [5173]" cmd /k "cd /d "%~dp0crs-frontend" && npm run dev"

echo.
echo ========================================================
echo   Tat ca cac dich vu da duoc khoi dong!
echo   Frontend: http://localhost:5173
echo   Gateway:  http://localhost:8080
echo ========================================================
pause
