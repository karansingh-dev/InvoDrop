import type { addClientSchema } from "@/validations/client/addClientSchema";
import z from "zod";

export type NewClientDataType = z.infer<typeof addClientSchema>;

export type ClientsDataType = NewClientDataType & {
  id: string;
  invoiceCount: number;
  totalBilledAmount: number;
};
