import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { response } from "../../utils/response";
import { customRequest } from "../../types/customRequest";


export const getOneInvoice = async (req: Request, res: Response) => {

    const invoiceId = req.params.invoiceId;
    const user: customRequest = req.user;

    if (invoiceId) {

        const invoice = await prisma.invoice.findUnique({
            where: {
                id: invoiceId

            }
            ,
            select: {
                id: true,
                invoiceNumber: true,
                grandTotal: true,
                issueDate: true,
                dueDate: true,
                status: true,
                currency: true,
                taxPercent: true,
                client: {
                    select: {
                        email: true,
                        companyName: true,
                        contactPersonName: true,
                        phoneNumber: true,
                        streetAddress: true,
                        city: true,
                        state: true,
                        country: true,
                        pinCode: true




                    }
                },
                items: {
                    select: {
                        name: true,
                        description: true,
                        quantity: true,
                        unitPrice: true,
                        totalPrice: true
                    }
                }


            }
        })


        if (invoice) {
            response.ok(res, "Invoices Fetched Successfully", 200, invoice);
            return;
        }
        else {
            response.error(res, "No Invoices Found", 404);
        }
    }


    else {
        response.error(res, "Invalid Paramters", 400);

    }
}

api.get("/get-invoice/:invoiceId", "protected", getOneInvoice);