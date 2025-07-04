import { response } from "../../utils/response";
import { Request, Response } from "express";
import { verificationCodeSchema } from "../../validations/user/verificationCodeSchema";
import prisma from "../../helpers/prismaClient";
import z from "zod";
import { api } from "../../routes/router";

type data = z.infer<typeof verificationCodeSchema>;

export const verifyCode = async (req: Request, res: Response) => {
  try {
    const data: data = req.body;

    const requestValidation = verificationCodeSchema.safeParse(data);

    if (!requestValidation.success) {
      response.error(res, "Invalid Data Sent", 400);
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

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

    await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        isVerified: true,
      },
    });

    response.ok(res, "User Verified Successfully", 200);
    return;
  } catch (error) {
    console.log("Error Verifying User", error);
    response.error(res, "Internal Server Error", 501);
    return;
  }
};

api.post("/verify-code", "noauth", verifyCode);
