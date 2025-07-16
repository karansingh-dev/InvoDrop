import { Request, Response } from "express";
import { response } from "../../utils/response";
import { signUpSchema } from "../../validations/user/signUpSchema";
import prisma from "../../helpers/prismaClient";
import { sendVerificationEmail } from "../../utils/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { api } from "../../routes/router";
import { NewUserDataType, UserSignUpDataType } from "../../types/user";

export const signUp = async (req: Request, res: Response) => {
  try {
    const user: UserSignUpDataType = req.body;

    //lower Casing the email before registering them to avoid any conflict
    user.email = user.email.toLowerCase();

    const requestValidation = signUpSchema.safeParse(user);

    if (!requestValidation.success) {
      return response.error(res, "Invalid Data Sent", 400);
      
    }

    let userExist;

    try {
      userExist = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error("DB: failed to check if user Exists : ", error.message);

      throw new Error(error.message);
    }

    const verifyCode = Math.floor(Math.random() * 1000000).toString();

    const verifyCodeExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    //user of Non-null assertion operator
    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(user.password, 10);
    } catch (error: any) {
      console.error("Failed to hashPassword", error.message);

      throw new Error("bcrypt error");
    }

    if (userExist) {
      if (userExist.isVerified) {
        return response.error(res, "User Already Exist With This Email", 409);
      }

      try {
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
      } catch (error: any) {
        console.error("DB: Failed to Update User Details", error.message);
        throw new Error("Database Error");
      }

      //handle when user is registered but not verified

      const fullName = `${user.firstName} ${user.lastName}`;

      let verificationResponse;
      try {
        verificationResponse = await sendVerificationEmail(
          user.email,
          fullName,
          verifyCode
        );
      } catch (error: any) {
        console.log("Email: Failed to send Verification Email", error.message);
        throw new Error(error.message);
      }

      if (!verificationResponse.success) {
        return response.error(res, verificationResponse.message, 400);
        
      }

      return response.ok(
        res,
        "User Registered Successfully, Please Verify Your Account",
        201
      );
      
    }

    //handles when user not exist

    const newUser: NewUserDataType = {
      firstName: user.firstName,
      lastName: user.lastName,
      password: hashedPassword,
      email: user.email,
      verifyCode,
      verifyCodeExpiresAt,
    };

    try {
      await prisma.user.create({
        data: newUser,
      });
    } catch (error: any) {
      console.error("DB: Failed to add New User", error.message);
      throw new Error(error.message);
    }

    const fullName = `${newUser.firstName} ${newUser.lastName}`;

    let verificationResponse;

    try {
      verificationResponse = await sendVerificationEmail(
        newUser.email,
        fullName,
        verifyCode
      );
    } catch (error: any) {
      console.log("Email: Failed to send Verification Email", error.message);
      throw new Error(error.message);
    }

    if (!verificationResponse.success) {
      return response.error(res, verificationResponse.message, 400);
      
    }

    return response.ok(
      res,
      "User Registered Successfully,Please Verify Your Account",
      201
    );
    
  } catch (error: any) {
    console.log("having error");
    console.log("Error Eegistering User", error.message);
    throw new Error(error.message);
  }
};

api.post("/sign-up", "noauth", signUp);
