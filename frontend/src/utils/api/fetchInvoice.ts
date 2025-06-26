import { apiCall } from "./apiCall"


export type invoiceDataType = {
    id: string,
    invoiceNumber: string,
    grandTotal: string,
    issueDate: string,
    dueDate: string,
    status: string,
    companyName: string
}


export async function fetchInvoices() {

const result = await apiCall<invoiceDataType[]>("/get-invoices", "GET", "protected");

    return result.data;

}