import { Request, Response } from "express";
import { UpdateUserDetails } from "../../types/user";
import { updateUserSchema } from "../../validations/user/updateUserSchema";
import { response } from "../../utils/response";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";

const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const userDetails: UpdateUserDetails = req.body;
    const user = req.user;

    const requestValidation = updateUserSchema.safeParse(userDetails);

    if (!requestValidation.success) {
      return response.error(res, "Invalid Data Sent", 400);
      
    }

    try {
      await prisma.user.update({
        where: {
          id: user.userId,
        },
        data: {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
        },
      });
    } catch (error) {
      console.error("DB: Failed to update User Details");
      throw error;
    }

    return response.ok(res, "Successfully Updated User Details", 200);
    
  } catch (error: any) {
    console.error("Error Updating User Details", error.message);
    throw error;
  }
};

api.put("/update-user-data", "protected", updateUserDetails);
