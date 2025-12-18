"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { loginSchema, type LoginInput } from "../_schemas/login.schema";
import { flattenError } from "zod";

type LoginResult = {
	success: boolean;
	message: string;
	errors?: Record<string, string[]>;
};

export async function loginAction(input: LoginInput): Promise<LoginResult> {
	const result = loginSchema.safeParse(input);
	if (!result.success) {
		const flattened = flattenError(result.error);
		return {
			success: false,
			message: "Error de validación",
			errors: flattened.fieldErrors,
		};
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: input.email,
				password: input.password,
			},
			headers: await headers(),
		});

		return {
			success: true,
			message: "Inicio de sesión exitoso",
		};
	} catch (error: unknown) {
		console.error("Login error:", error);

		// BetterAuth errors come with specific structure
		if (error && typeof error === "object" && "message" in error) {
			const errorMessage = String(error.message);

			// Map common BetterAuth errors to user-friendly messages
			if (errorMessage.includes("Invalid password")) {
				return {
					success: false,
					message: "Contraseña incorrecta. Por favor, verifica tu contraseña.",
				};
			}

			if (errorMessage.includes("User not found")) {
				return {
					success: false,
					message: "No existe una cuenta con este email.",
				};
			}

			return {
				success: false,
				message: errorMessage || "Credenciales inválidas",
			};
		}

		return {
			success: false,
			message: "Error al iniciar sesión. Por favor, intenta nuevamente.",
		};
	}
}
