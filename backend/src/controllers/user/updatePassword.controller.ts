import { Request, Response } from "express";
import { UpdatePassword } from "../../types/user";
import { passwordSchema } from "../../validations/user/passwordSchema";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import bcrypt from "bcryptjs";
import { api } from "../../routes/router";

const updatePassword = async (req: Request, res: Response) => {
  try {
    const updatedPassword: UpdatePassword = req.body;

    const user = req.user;

    const requestValidation = passwordSchema.safeParse(updatedPassword);

    if (!requestValidation.success) {
      return response.error(res, "Invalid Data Sent", 400);
    }

    const bothPasswordsCorrect =
      updatedPassword.newPassword === updatedPassword.confirmNewPassword;

    let userData;
    try {
      userData = await prisma.user.findUnique({
        where: {
          id: user.userId,
        },
      });
    } catch (error) {
      console.log("DB: Failed to Load user");
      throw error;
    }

    if (!bothPasswordsCorrect) {
      return response.error(res, "Confirm Password Do Not Match", 400);
    }
    if (!userData) {
      return response.error(res, "No User Exists", 404);
    }
    let passwordsMatch;

    try {
      passwordsMatch = await bcrypt.compare(
        updatedPassword.currentPassword,
        userData.password
      );
    } catch (error) {
      console.log("Failed to Match User Current and new Password");
      throw error;
    }

    if (!passwordsMatch) {
      return response.error(res, "Wrong Current Password", 400);
    }

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(updatedPassword.newPassword, 10);
    } catch (error) {
      console.error("Failed to hashPassword");

      throw error;
    }

    try {
      await prisma.user.update({
        where: {
          id: user.userId,
        },
        data: {
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.log("DB: Failed to Update Password");
      throw error;
    }

    return response.ok(res, "Password Updated Successfully", 200);
  } catch (error) {
    console.error("Failed to Update user Password");
    throw error;
  }
};

api.put("/update-user-password", "protected", updatePassword);
