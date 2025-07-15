import z from "zod";
import { signUpSchema } from "../validations/user/signUpSchema";
import { verificationCodeSchema } from "../validations/user/verificationCodeSchema";
import { loginSchema } from "../validations/user/loginSchema";
import { updateUserSchema } from "../validations/user/updateUserSchema";
import { passwordSchema } from "../validations/user/passwordSchema";
import { onboardingSchema } from "../validations/user/onBoardingSchema";

export type UserSignUpDataType = z.infer<typeof signUpSchema>;
export type UserLoginDataType = z.infer<typeof loginSchema>;

export type NewUserDataType = UserSignUpDataType & {
  verifyCode: string;
  verifyCodeExpiresAt: Date;
};

export type UserVerificationDataType = z.infer<typeof verificationCodeSchema>;

export type OnBoardingDataType = z.infer<typeof onboardingSchema>;


export type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin",
  isCompanyAdded:boolean
};


export type UpdateUserDetails = z.infer<typeof updateUserSchema>

export type UpdatePassword = z.infer<typeof passwordSchema>
