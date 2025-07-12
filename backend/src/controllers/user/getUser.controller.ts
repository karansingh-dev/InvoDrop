import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { response } from "../../utils/response";
import { api } from "../../routes/router";
import { UserDetails } from "../../types/user";

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    let userData;
    try {
      userData = await prisma.user.findUnique({
        where: {
          id: user.userId,
        },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });
    } catch (error: any) {
      console.log("DB: Error getting User", error.message);
      throw new Error(error.message);
    }

    if (!userData) {
      response.error(res, "No User Found", 404);
      return;
    }

    const responseData: UserDetails = {
      ...userData,
      isCompanyAdded: false,
    };

    let companyData;

    try {
      companyData = await prisma.company.findUnique({
        where: {
          userId: user.userId,
        },
      });
    } catch (error: any) {
      console.log("DB: Error getting User Company", error.message);
      throw new Error(error.message);
    }

    if (companyData) responseData.isCompanyAdded = true;

    response.ok(res, "User Data Found Successfully", 200, responseData);
    return;
  } catch (error: any) {
    console.error("Error Gettung User Data", error.message);
    throw new Error(error.message);
  }
};

api.get("/get-user-data", "protected", getUser);
