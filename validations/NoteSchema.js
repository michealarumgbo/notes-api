import z from "zod";

export const noteSchema = z.object({
  title: z.string("Notes name is required").trim(),
  content: z.string("Notes Content is required").trim(),
});
