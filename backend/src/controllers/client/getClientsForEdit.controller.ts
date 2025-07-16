import { Request, Response } from "express";
import { response } from "../../utils/response";
import { api } from "../../routes/router";
import prisma from "../../helpers/prismaClient";

type clientRes = {
  id: string;
  companyName: string;
  contactPersonName: string;
  phoneNumber: string;
  status: boolean;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export const getClientsForEdit = async (req: Request, res: Response) => {
  const user = req.user

  if (user) {
    const client = await prisma.client.findMany({
      where: {
        userId:user.userId
      },
      select: {
        id: true,
        companyName: true,
        contactPersonName: true,
        phoneNumber: true,
        email: true,
        streetAddress: true,
        city: true,
        state: true,
        country: true,
        pinCode: true,
        status: true,
      },
    });

    if (client) {
      return response.ok<clientRes[]>(res, "Fetched Client Successfully", 200, client);
      
    } else {
      return response.error(res, "Failed To Fetch Client Details", 400);
      
    }
  } else {
    return response.error(res, "Invalid Parameters Sent", 400);
  }
};

api.get("/get-clients-for-edit", "protected", getClientsForEdit);
