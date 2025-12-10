#!/bin/bash
set -e

echo "🔄 Aplicando migración de Prisma..."
pnpm prisma migrate dev

echo "✨ Regenerando cliente de Prisma..."
pnpm prisma generate

echo "✅ Todo listo! El cliente de Prisma ha sido actualizado."
