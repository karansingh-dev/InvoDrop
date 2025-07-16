import { addClientSchema } from "../validations/client/addClientSchema";
import z from "zod";

export type ClientDataType = z.infer<typeof addClientSchema>;

export type NewClientDataType = ClientDataType & {
  userId: string;
};
