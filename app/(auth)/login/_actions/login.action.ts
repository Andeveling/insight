"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { loginSchema, type LoginInput } from "../_schemas/login.schema"
import { flattenError } from "zod"

type LoginResult = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function loginAction(input: LoginInput): Promise<LoginResult> {
  const result = loginSchema.safeParse(input)
  if (!result.success) {
    const flattened = flattenError(result.error)
    return {
      success: false,
      message: "Error de validación",
      errors: flattened.fieldErrors,
    }
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Inicio de sesión exitoso",
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "Credenciales inválidas",
      }
    }

    return {
      success: false,
      message: "Credenciales inválidas",
    }
  }
}
