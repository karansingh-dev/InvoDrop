import prisma from "../../helpers/prismaClient";
import { Request, Response } from "express";
import { api } from "../../routes/router";
import { response } from "../../utils/response";
import z from "zod"
import { createInvoiceSchema } from "../../validations/invoice/createInvoiceSchema";
import { customRequest } from "../../types/customRequest";
import { invoiceItemSchema } from "../../validations/invoice/invoiceItemSchema";
import { downloadPdf } from "../../utils/downloadPdf";
import { uploadPdf } from "../../utils/uploadPdf";
import { sendPdf } from "../../utils/sendPdf";


export type invoiceData = z.infer<typeof createInvoiceSchema>

export type currencyType = "Rupees" | "Dollar" | "Euro" | "Pound" | "Yen"

export type itemType = z.infer<typeof invoiceItemSchema>

export interface items extends itemType {
    invoiceId: string
}

export interface newInvoice {
    invoiceNumber: string;
    userId: string
    clientId: string
    subTotal: number
    taxPercent: number;
    grandTotal: number;
    issueDate: Date,
    dueDate: Date,
    currency: currencyType
    notes: string

}

export const createInvoice = async (req: Request, res: Response) => {

    const invoiceData: invoiceData = req.body;
    const user: customRequest = req.user;

    // so that zod can accept 
    invoiceData.issueDate = new Date(invoiceData.issueDate);
    invoiceData.dueDate = new Date(invoiceData.dueDate);

    const requestValidation = createInvoiceSchema.safeParse(invoiceData);



    if (requestValidation.success) {
        const client = await prisma.client.findFirst({
            where: {
                email: invoiceData.clientEmail,
                userId:user.userId
            }
        })

        if (client) {

            const invoiceCount = await prisma.invoice.count({
                where: {
                    userId: user.userId,
                },
            });


            const invNumber = `INV-${invoiceCount + 1}`


            const Invoice: newInvoice = {
                invoiceNumber: invNumber,
                userId: user.userId,
                clientId: client.id,
                subTotal: invoiceData.subTotal,
                taxPercent: invoiceData.taxPercent,
                grandTotal: invoiceData.grandTotal,
                issueDate: invoiceData.issueDate,
                dueDate: invoiceData.dueDate,
                currency: invoiceData.currency,
                notes: invoiceData.notes
            }

            const newInvoice = await prisma.invoice.create({
                data: Invoice
            });

            const newInvoiceItems: items[] = invoiceData.invoiceItems.map((item) => {
                return {
                    invoiceId: newInvoice.id,
                    name: item.name,
                    description: item.description,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice
                }
            });

            await prisma.item.createMany({
                data: newInvoiceItems
            })


            await prisma.client.update({
                where: {
                   id:client.id
                },
                data: {
                    invoiceCount: { increment: 1 },
                    totalBilledAmount: { increment: invoiceData.grandTotal }
                }
            })


            const isPdfDownloaded = await downloadPdf(newInvoice.id);

            if (isPdfDownloaded.success) {

                const isPdfUploaded = await uploadPdf();

                if (isPdfUploaded.success && isPdfUploaded.url) {

                    const sentPdf = await sendPdf(invoiceData.clientEmail, isPdfUploaded.url);

                    if (sentPdf.success) {
                        response.ok(res, "Invoice Created Successfully", 201);
                        return;

                    }
                    else {
                        await prisma.invoice.delete({
                            where: {
                                id: newInvoice.id
                            }
                        })
                        response.error(res, "Failed to create invoice", 400);
                        return
                    }

                }
                else {
                    await prisma.invoice.delete({
                        where: {
                            id: newInvoice.id
                        }
                    })
                    console.error("failed to Upload pdf");
                    response.error(res, "Failed to create invoice", 400);
                    return

                }

            }
            else {

                await prisma.invoice.delete({
                    where: {
                        id: newInvoice.id
                    }
                })
                console.error("failed to download pdf");
                response.error(res, "Failed to create invoice", 400);
                return
            }


        }
        else {
            response.error(res, "No Client Exists", 404);
            return

        }

    }
    else {
        console.log(requestValidation.error.message)
        response.error(res, "Invalid Data Sent", 400);
        return
    }



}



api.post("/create-invoice", "protected", createInvoice);