import z from "zod";

export const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmNewPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(18, { message: "Password must not exceed 18 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, and one number",
    }),
});
