@echo off
rem Opens the CraftedSoft website on http://localhost:5500 (needs Python).
rem Serving over http enables the smooth page-to-page transitions that
rem browsers switch off for files opened straight from disk.
cd /d "%~dp0"
start "" http://localhost:5500/
python -m http.server 5500
