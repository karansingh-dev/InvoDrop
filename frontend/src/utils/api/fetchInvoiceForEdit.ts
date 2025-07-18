import { apiCall } from "./apiCall";

export type invoiceDataType = {
  id: string;
  invoiceNumber: string;
  notes: string;
  subTotal: number;
  taxPercent: number;
  grandTotal: number;
  issueDate: Date;
  dueDate: Date;
  currency: "Rupees" | "Dollar" | "Euro" | "Pound" | "Yen";
  client: {
    id: string;
    companyName: string;
    contactPersonName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
    email: string;
  };

  items: {
    name: string;
    description: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
};

export type editclientDataType = {
  id: string;
  companyName: string;
  contactPersonName: string;
  phoneNumber: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export const getOneInvoiceForEdit = async (id: string) => {
  const result = await apiCall<invoiceDataType>(
    `/get-invoice/${id}`,
    "GET",
    "protected"
  );

  

  return result.data;
};
