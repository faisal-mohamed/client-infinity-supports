@echo off
echo Fixed the failing migration. Now deploying...
npx prisma migrate deploy
if %errorlevel% equ 0 (
    echo Regenerating Prisma client...
    npx prisma generate
    echo Success! Migrations applied.
) else (
    echo Migration failed. Check the error above.
)
pause
