-@echo off
title Start Course Service (Port 8085)
echo Dang khoi dong lai Course Service tren port 8085...

start "2. Course Service [8085]" cmd /k "set "JAVA_HOME=C:\Program Files\Java\jdk-23" && cd /d "%~dp0course-service" && mvnw.cmd spring-boot:run"

echo Da khoi dong Course Service [Port 8085] trong cua so moi!
