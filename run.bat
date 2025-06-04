@echo off
set EXE=dist\qidian-decryptor-win.exe
set INPUT=test-data\input.json
set OUTPUT=test-data\output.txt

echo Deleting old output file...
del "%OUTPUT%" >nul 2>&1

echo Running decryptor...
"%EXE%" "%INPUT%" "%OUTPUT%"

echo Done! Output saved to %OUTPUT%
pause
