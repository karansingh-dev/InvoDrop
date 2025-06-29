import { Request, Response } from "express";
import prisma from "../../helpers/prismaClient";
import { api } from "../../routes/router";
import { response } from "../../utils/response";



export const getInvoices = async (req: Request, res: Response) => {

    const user = req.user;

    const invoices = await prisma.invoice.findMany({
        where: {
            userId: user.userId
        },
        orderBy:{
            createdAt:"asc"

        },
        select: {
            id: true,
            invoiceNumber: true,
            grandTotal: true,
            issueDate: true,
            dueDate: true,
            status: true,
            currency: true,
            client: {
                select: {
                    companyName: true
                }
            }

        }

    })

    if (invoices) {

        const Data = invoices.map((invoice) => {
            return {
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                grandTotal: invoice.grandTotal,
                issueDate: invoice.issueDate,
                dueDate: invoice.dueDate,
                status: invoice.status,
                companyName: invoice.client.companyName,
                currency: invoice.currency
            }
        })

        response.ok(res, "Invoices Fetched Successfully", 200, Data);
        return;
    }
    else {
        response.error(res, "No Invoices Found", 404);
    }
}

api.get("/get-invoices", "protected", getInvoices);