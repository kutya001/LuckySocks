@echo off
echo Запуск локального сервера SOCKS.PRO...
echo Пожалуйста, не закрывайте это окно! Сервер работает.
start http://localhost:8000
python -m http.server 8000
pause
