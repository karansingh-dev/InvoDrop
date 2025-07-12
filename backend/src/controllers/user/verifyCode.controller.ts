import { response } from "../../utils/response";
import { Request, Response } from "express";
import { verificationCodeSchema } from "../../validations/user/verificationCodeSchema";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { UserVerificationDataType } from "../../types/user";

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const data: UserVerificationDataType = req.body;

    //lower casing the email for any conflict

    data.email = data.email.toLowerCase();

    const requestValidation = verificationCodeSchema.safeParse(data);

    if (!requestValidation.success) {
      response.error(res, "Invalid Data Sent", 400);
      return;
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
    } catch (error: any) {
      console.error("DB: Error Getting User", error.message);
      throw new Error(error.message);
    }

    if (!user) {
      response.error(
        res,
        "Incorrect Email, No User Exists With This Email",
        404
      );
      return;
    }

    const isCodeValid = user.verifyCode === data.verifyCode;

    if (!isCodeValid) {
      response.error(res, "Incorrect Verification Code", 400);
      return;
    }

    const isCodeExpired = user.verifyCodeExpiresAt < new Date(Date.now());

    if (isCodeExpired) {
      response.error(res, "Verification Code Expired", 400);
      return;
    }

    try {
      await prisma.user.update({
        where: {
          email: data.email,
        },
        data: {
          isVerified: true,
        },
      });
    } catch (error: any) {
      console.error(
        "DB: failed to Updated User Verified Status",
        error.message
      );
      throw new Error(error.message);
    }

    response.ok(res, "User Verified Successfully", 200);
    return;
  } catch (error: any) {
    console.log("Error Verifying User", error.message);
    throw new Error(error.message);
  }
};

api.post("/verify-code", "noauth", verifyCode);
