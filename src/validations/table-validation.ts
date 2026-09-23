import z from "zod";

export const tableSchema = z.object({
  name: z.string(),
  description: z.string(),
  capacity: z.number(),
  status: z.string(),
});

export const tableFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  status: z.string().min(1, { message: "Status is required" }),
});

export type Table = z.infer<typeof tableSchema> & { id: string };
export type TableForm = z.infer<typeof tableFormSchema>;