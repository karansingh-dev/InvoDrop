import { apiCall } from "./apiCall";
import type { editclientDataType } from "./fetchInvoiceForEdit";

export const getClientsForEdit = async () => {
  const result = await apiCall<editclientDataType[]>(
    "/get-clients-for-edit",
    "GET",
    "protected"
  );



  return result.data;
};
