import z from "zod";

export const signUpSchema = z.object({
    firstName: z.string().min(1, "First name must be at least 1 character").max(50, "First name must at most 50 characters"),
    lastName: z.string().min(1, "last name must be at least 1 character").max(50, "last name must at most 50 characters"),
    email: z.string().email("Must be a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters").max(18, "Password must be at most 18 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#+=^_-]{3,}$/,"Password must contain at least 1 uppercase and 1 lowercase chracter"),
})