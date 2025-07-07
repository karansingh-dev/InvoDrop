import { apiCall } from "./apiCall"


export type invoiceDataType = {
    id: string,
    invoiceNumber: string,
    grandTotal: string,
    issueDate: Date,
    dueDate: Date,
    status: string,
    companyName: string
}


export async function fetchInvoices() {

    const result = await apiCall<invoiceDataType[]>("/get-invoices", "GET", "protected");

    if (result.data === undefined) throw new Error("error fetching invoices")
    return result.data;

}