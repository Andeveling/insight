/**
 * Script para crear un usuario de prueba usando BetterAuth API
 * Esto garantiza que el hash sea compatible con BetterAuth
 */

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma.db";

async function testCreateUser() {
  console.log("🧪 Creating test user via BetterAuth API...");

  try {
    // Intentar crear un usuario usando la API interna de BetterAuth
    const result = await auth.api.signUpEmail({
      body: {
        email: "test@nojau.co",
        password: "test-123",
        name: "Test User",
      },
    });

    console.log("✅ User created successfully:", result);

    // Verificar el hash generado en la base de datos
    const account = await prisma.account.findFirst({
      where: {
        userId: result.user.id,
      },
    });

    console.log("\n📝 Generated password hash:", account?.password);
    console.log("📏 Hash length:", account?.password?.length);
    console.log("🔤 Hash format:", account?.password?.substring(0, 10) + "...");
  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreateUser();
