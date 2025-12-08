import type { PrismaClient } from '../../generated/prisma/client'

export async function seedUsers(prisma: PrismaClient) {
    console.log('👤 Seeding users...')

    // BetterAuth usa bcrypt para hashear contraseñas
    // Para desarrollo, usaremos contraseñas simples que BetterAuth hasheará
    // Nota: En producción, BetterAuth se encarga del hashing automáticamente

    const testUsers = [
        {
            id: 'test-user-1',
            name: 'Test User',
            email: 'test@example.com',
            emailVerified: true,
        },
        {
            id: 'test-user-2',
            name: 'Admin User',
            email: 'admin@example.com',
            emailVerified: true,
        },
        {
            id: 'test-user-3',
            name: 'Demo User',
            email: 'demo@example.com',
            emailVerified: true,
        },
    ]

    // Contraseña para todos los usuarios de prueba: "password123"
    // BetterAuth requiere que las cuentas se creen con el provider "credential"
    const password = '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u' // bcrypt hash de "password123"

    for (const userData of testUsers) {
        // Crear o actualizar usuario
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: userData,
        })

        // Crear cuenta con credenciales
        await prisma.account.upsert({
            where: {
                providerId_accountId: {
                    providerId: 'credential',
                    accountId: user.id,
                },
            },
            update: {},
            create: {
                accountId: user.id,
                providerId: 'credential',
                userId: user.id,
                password: password,
            },
        })

        console.log(`  ✓ Created user: ${userData.email}`)
    }

    console.log('✅ Users seeded successfully!')
    console.log('\n📝 Test credentials:')
    console.log('  Email: test@example.com')
    console.log('  Email: admin@example.com')
    console.log('  Email: demo@example.com')
    console.log('  Password: password123')
}
