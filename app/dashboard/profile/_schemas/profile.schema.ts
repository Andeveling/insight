import { z } from "zod";

export const profileSchema = z.object({
	career: z.string().optional(),
	age: z.coerce
		.number()
		.min(18, "Debes ser mayor de 18 años")
		.optional()
		.or(z.literal(0)),
	gender: z
		.enum(["M", "F", "O"], {
			message: "Selecciona un género válido",
		})
		.optional(),
	description: z.string().max(500, "La descripción es muy larga").optional(),
	hobbies: z.array(z.string()).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
