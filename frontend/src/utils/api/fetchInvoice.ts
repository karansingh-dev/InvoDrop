import { apiCall } from "./apiCall"





export const fetchInvoices = async () => {

    const result = await apiCall("/get-invoices", "get", "auth");

    if (result.success) {
        return result.data;
    }
    return result.data;





}