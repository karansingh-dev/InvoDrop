import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { response } from "../../utils/response";


export const getInvoices = async (req: Request, res: Response) => {

    const user = req.user;

    const invoices = await prisma.invoice.findMany({
        where: {
            userId: user.userId
        }
    })

    if (invoices) {
        response.ok(res, "Invoices Fetched Successfully", 200, invoices);
        return;
    }
    else {
        response.error(res, "No Invoices Found", 404);
    }
}

api.get("/get-invoices","protected",getInvoices);