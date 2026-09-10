import z from "zod";

export const menuSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discount: z.number(),
  image_url: z.union([z.string(), z.instanceof(File)]),
  is_available: z.boolean(),
});

export type Menu = z.infer<typeof menuSchema> & { id: string };
