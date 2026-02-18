@echo off
title Project Entity Launcher
echo ===================================================
echo   Project Entity Launch Sequence Initiated...
echo ===================================================

echo [1/3] Starting Backend Service...
start "Project Entity Backend" dotnet run --project "src/ProjectEntity.Backend/ProjectEntity.Backend.csproj"

echo [2/3] Syncing Card Data...
cd project-entity-frontend
call npm run sync-cards

echo [3/3] Launching Frontend Interface...
echo Close this window to stop the frontend server.
npm run dev
pause
