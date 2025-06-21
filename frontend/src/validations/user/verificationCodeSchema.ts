import z from "zod";


export const verificationCodeSchema = z.object({
    verifyCode: z.string().min(6, "Verification code must be at least 6 chracters").max(6, "Verification code must be at most 6 chracters"),
    email: z.string().email("Must be a valid email address")

})