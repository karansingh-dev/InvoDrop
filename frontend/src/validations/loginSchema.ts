import z from "zod";


export const loginSchema = z.object({
    email: z.string().email("Must be a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters").max(18, "Password must be at most 18 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#+=^_-]{3,}$/, "Password must contain at least 1 uppercase and 1 lowercase chracter")
});
