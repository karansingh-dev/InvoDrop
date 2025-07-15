import type { loginSchema } from "@/validations/user/loginSchema";
import type { onboardingSchema } from "@/validations/user/onBoardingSchema";
import type { passwordSchema } from "@/validations/user/passwordSchema";
import type { signUpSchema } from "@/validations/user/signUpSchema";
import type { updateUserSchema } from "@/validations/user/updateUserSchema";
import type { verificationCodeSchema } from "@/validations/user/verificationCodeSchema";
import z from "zod";

export type UserSignupFormData = z.infer<typeof signUpSchema>;
export type UserLoginFormData = z.infer<typeof loginSchema>;

export type UserVerificationData = z.infer<typeof verificationCodeSchema>;

export type UserDetailsType = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isCompanyAdded: boolean;
};

export type UserPasswordDateType = z.infer<typeof passwordSchema>;
export type UserUpdateFormData = z.infer<typeof updateUserSchema>;
export type OnBoardingDataType = z.infer<typeof onboardingSchema>;
