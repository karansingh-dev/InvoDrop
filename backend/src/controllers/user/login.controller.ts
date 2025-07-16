import { Request, Response } from "express";
import { loginSchema } from "../../validations/user/loginSchema";
import prisma from "../../helpers/prismaClient";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { response } from "../../utils/response";
import { api } from "../../routes/router";
import bcrypt from "bcryptjs";
import { UserLoginDataType } from "../../types/user";

export const login = async (req: Request, res: Response) => {
  try {
    const user: UserLoginDataType = req.body;

    // lowercasing the email for any conflict
    user.email = user.email.toLowerCase();

    const requestValidation = loginSchema.safeParse(user);

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
      console.error("DB: Failed to check Existing User", error.message);
      throw new Error(error.message);
    }

    if (!userExist) {
      return response.error(
        res,
        "Incorrect Email, No User Exists With This Email",
        404
      );
   
    }

    let isPasswordCorrect;

    try {
      isPasswordCorrect = await bcrypt.compare(
        user.password,
        userExist.password
      );
    } catch (error: any) {
      console.error("Failed to Compare Password", error.message);
      throw new Error(error.message);
    }

    if (!isPasswordCorrect) {
      return response.error(res, "Incorrect Password", 401);
  
    }

    const payload = {
      userId: userExist.id,
      email: userExist.email,
      role: userExist.role,
    };

    //generating token
    const token = jwt.sign(payload, config.JWT_SECRET!);

    return response.ok(res, "Login Successfull", 200, token);
 
  } catch (error: any) {
    console.error("Error Loging In the User", error.message);
    throw new Error(error.message);
  }
};

api.post("/login", "noauth", login);
