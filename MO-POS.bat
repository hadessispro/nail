@echo off
title Rose Nail Spa POS
echo Dang mo phan mem Rose Nail Spa POS...
start msedge --app="%~dp0index.html" 2>nul || start chrome --app="%~dp0index.html" 2>nul || start "" "%~dp0index.html"
exit
