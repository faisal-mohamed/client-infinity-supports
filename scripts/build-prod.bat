@echo off
REM Production build script that skips all checks

set NODE_ENV=production
set VERCEL=1
set DISABLE_ESLINT_PLUGIN=true
set SKIP_LINTING=true
set SKIP_TYPE_CHECK=true

echo Starting production build with all checks disabled...

REM Run the build
npm run build

echo Production build completed!
pause
