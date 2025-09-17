#!/bin/bash
echo "Deploying pending Prisma migrations..."
npx prisma migrate deploy
echo "Regenerating Prisma client..."
npx prisma generate
echo "Done! Restart your application."
