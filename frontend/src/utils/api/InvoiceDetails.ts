

import type { clientsDataType } from "@/components/custom/ClientCard";
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


export async function getInvoiceDeatils(): Promise<{
    clients: clientsDataType[],
    count: number
}> {

    const res1 = await apiCall<invoiceDataType[]>("/get-invoices", "GET", "protected");
    const res2 = await apiCall<clientsDataType[]>("/get-clients", "GET", "protected");

    const count = res1.data.length + 1;


    const data = {
        clients: res2.data,
        count
    }

    return data
}



