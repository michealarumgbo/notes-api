import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email is required").trim(),
  password: z.string("Password is required").trim().min(8),
});
