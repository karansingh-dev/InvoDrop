import { Request, Response } from "express";
import { response } from "../../utils/response";
import { signUpSchema } from "../../validations/user/signUpSchema";
import prisma from "../../helpers/prismaClient";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";
import bcrypt from "bcryptjs";
import z from "zod";
import { api } from "../../routes/router";

type user = z.infer<typeof signUpSchema>;

interface newUser extends user {
  verifyCode: string;
  verifyCodeExpiresAt: Date;
}

export const signUp = async (req: Request, res: Response) => {
  try {
    const user: user = req.body;
    user.email.toLowerCase();
    const requestValidation = signUpSchema.safeParse(user);

    if (!requestValidation.success) {
      response.error(res, "Invalid Data Sent", 400);
      return;
    }

    const userExist = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const verifyCode = Math.floor(Math.random() * 1000000).toString();

    const verifyCodeExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    //user of Non-null assertion operator
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (userExist) {
      if (userExist.isVerified) {
        response.error(res, "User Already Exist With This Email", 409);
        return;
      }

      //handle when user is registered but not verified
      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiresAt,
        },
      });
      const fullName = `${user.firstName} ${user.lastName}`;
      const verificationResponse = await sendVerificationEmail(
        user.email,
        fullName,
        verifyCode
      );

      if (!verificationResponse.success) {
        response.error(res, verificationResponse.message, 400);
        return;
      }

      response.ok(
        res,
        "User registered Successfully, Please verify your account",
        200
      );
      return;
    }

    //handles when user not exist

    const newUser: newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      password: hashedPassword,
      email: user.email,
      verifyCode,
      verifyCodeExpiresAt,
    };
    await prisma.user.create({
      data: newUser,
    });

    const fullName = `${newUser.firstName} ${newUser.lastName}`;

    const verificationResponse = await sendVerificationEmail(
      newUser.email,
      fullName,
      verifyCode
    );

    if (!verificationResponse.success) {
      response.error(res, verificationResponse.message, 400);
      return;
    }

    response.ok(
      res,
      "User Registered Successfully,Please Verify Your Account",
      201
    );
    return;
  } catch (error) {
    console.log("Error Eegistering User", error);
    response.error(res, "Internal Server Error", 501);
  }
};

api.post("/sign-up", "noauth", signUp);
