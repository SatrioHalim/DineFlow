import z from "zod";

export const loginSchema = z.object({
    email:z.string().min(1, 'Email is required').email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

export type LoginForm = z.infer<typeof loginSchema>;