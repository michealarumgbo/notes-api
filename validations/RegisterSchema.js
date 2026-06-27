import z from "zod";

export const registerSchema = z.object({
  name: z.string("Name is required").trim(),
  email: z.email("Email is required").trim(),
  password: z.string("Password is required").trim().min(8),
});
