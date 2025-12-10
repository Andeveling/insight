import { z } from "zod";

export const UserDnaDimensionSchema = z.object({
  name: z.string().describe("Nombre de la dimensión (ej. Pensamiento, Acción)"),
  strengths: z.array(z.string()).describe("Lista de fortalezas involucradas en esta dimensión"),
  description: z.string().describe("Descripción de cómo interactúan estas fortalezas"),
});

export const UserDnaSynergySchema = z.object({
  strengths: z.array(z.string()).describe("Par de fortalezas que crean la sinergia"),
  effect: z.string().describe("Nombre del efecto sinérgico"),
  description: z.string().describe("Descripción de la potenciación mutua"),
});

export const UserDnaSchema = z.object({
  title: z.string().describe("Título del ADN (ej. Estratega Emocional...)"),
  summary: z.string().describe("Resumen ejecutivo del perfil"),
  dimensions: z.array(UserDnaDimensionSchema).describe("Análisis por dimensiones"),
  synergies: z.array(UserDnaSynergySchema).describe("Fortalezas sinérgicas"),
  idealRole: z.array(z.string()).describe("Puntos clave sobre el rol ideal"),
  purpose: z.string().describe("Frase de reflexión de propósito"),
});

export type UserDnaData = z.infer<typeof UserDnaSchema>;
