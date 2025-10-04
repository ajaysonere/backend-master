
import { email, z } from "zod";

export const userSchema = z.object({
  id: z.string(), 
  name: z.string().min(3, "Name must contain at least 3 characters"),
  email: z
    .email("Please provide a valid email address") 
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(25, "Password cannot exceed 25 characters"),
  profile: z
    .string()
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
})


export const createUserSchema = userSchema.omit({ id: true });
export const updateUserSchema = createUserSchema.partial();
