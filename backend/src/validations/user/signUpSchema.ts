import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .nonempty({ message: "First name is required" })
    .max(50, { message: "First name must be at most 50 characters" }),

  lastName: z
    .string()
    .trim()
    .nonempty({ message: "Last name is required" })
    .max(50, { message: "Last name must be at most 50 characters" }),

  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
});
