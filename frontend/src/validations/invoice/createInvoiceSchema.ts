import z from "zod";
import { invoiceItemSchema } from "./invoiceItemSchema";




const invoiceItemDetails = z.array(invoiceItemSchema);


export const createInvoiceSchema = z.object({
    clientEmail: z.string().email("Must be a valid email address"),
    subTotal: z.number(),
    taxPercent: z.number(),
    grandTotal: z.number(),
    issueDate: z.date(),
    dueDate: z.date(),
    currency: z.enum(["Rupees", "Dollar", "Euro", "Pound", "Yen"]),
    invoiceItems: invoiceItemDetails,
    notes:z.string().max(150,"Must be at most 150 characters")
})






