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

}


export const getOneClient = async (req: Request, res: Response) => {

    const clientId = req.params.clientId;

    if (clientId) {

        const client = await prisma.client.findUnique({
            where: {
                id: clientId
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
                status: true

            }
        });


        if (client) {
            response.ok<clientRes>(res, "Fetched Client Successfully", 200, client);
            return;
        }
        else {
            response.error(res, "Failed To Fetch Client Details", 400);
            return;
        }


    }
    else {
        response.error(res, "Invalid Parameters Sent", 400);
    }


}


api.get("/get-one-client/:clientId", "protected", getOneClient);
