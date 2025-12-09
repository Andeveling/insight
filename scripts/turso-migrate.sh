#!/bin/bash

# Script para aplicar el schema de Prisma a Turso
# Uso: ./scripts/turso-migrate.sh

set -e

echo "🔍 Verificando variables de entorno..."

if [ -z "$TURSO_DATABASE_URL" ]; then
    echo "❌ Error: TURSO_DATABASE_URL no está configurada"
    echo "Por favor, configura las variables de entorno de Turso"
    exit 1
fi

if [ -z "$TURSO_AUTH_TOKEN" ]; then
    echo "❌ Error: TURSO_AUTH_TOKEN no está configurada"
    echo "Por favor, configura las variables de entorno de Turso"
    exit 1
fi

echo "✅ Variables de entorno configuradas"
echo ""
echo "📦 Generando cliente Prisma..."
pnpm db:generate

echo ""
echo "🚀 Aplicando schema a Turso..."
echo "Database: $TURSO_DATABASE_URL"
echo ""

# Usar prisma db push para aplicar el schema directamente
# Esto funciona mejor con Turso que las migraciones tradicionales
pnpm db:push

echo ""
echo "✅ Schema aplicado exitosamente a Turso!"
echo ""
echo "🌱 ¿Deseas ejecutar los seeders ahora? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌱 Ejecutando seeders en Turso..."
    pnpm db:seed:turso
    echo ""
    echo "✅ ¡Seeders ejecutados exitosamente!"
else
    echo ""
    echo "💡 Para ejecutar los seeders más tarde, usa:"
    echo "   pnpm db:seed:turso"
fi

echo ""
echo "🎉 ¡Proceso completado!"
