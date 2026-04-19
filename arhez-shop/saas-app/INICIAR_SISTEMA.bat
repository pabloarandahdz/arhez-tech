@echo off
title Arhez Shop - Inicializando Sistema...
color 0A

echo ==================================================
echo   INICIANDO SERVIDOR LOCAL ARHEZ SHOP (SAAS)
echo ==================================================
echo.

echo Comprobando ejecutable Node.js portatil...
set "PATH=%~dp0node-v24.14.1-win-x64;%PATH%"

node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo [!] ATENCION: No se detecto el ejecutable portatil de Node.js.
    echo.
    echo Asegurate de que la carpeta "node-v24.14.1-win-x64" se encuentre
    echo junto a la carpeta "saas-app" para que el sistema pueda arrancar.
    echo.
    pause
    exit
)

echo [1/3] Comprobando paquetes e instalando la base de datos...
cd server
call npm install --silent
echo.
echo [2/3] Arrancando los servicios seguros...
start cmd /k "title Servidor Arhez Shop (NO CERRAR) && node index.js"
echo.
echo [3/3] Abriendo el sistema en tu navegador web predeterminado...
timeout /t 3 /nobreak > nul

REM Minimizar todas las ventanas del sistema actual para limpiar la vista
powershell -command "(New-Object -ComObject Shell.Application).MinimizeAll()"

REM Abrir el navegador en primer plano
start http://localhost:3000/app/

echo.
echo ==================================================
echo El sistema se abrio en tu navegador. 
echo La ventana negra de la consola tambien ha sido minimizada.
echo ==================================================
exit
