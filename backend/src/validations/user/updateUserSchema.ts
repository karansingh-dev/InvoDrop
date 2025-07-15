import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .nonempty({ message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters" })
    .trim(),

  lastName: z
    .string()
    .nonempty({ message: "Last name is required" })
    .max(50, { message: "Last name must be at most 50 characters" })
    .trim(),

  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Enter a valid email address" })
    .trim(),
});
