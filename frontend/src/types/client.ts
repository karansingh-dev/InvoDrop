import type { addClientSchema } from "@/validations/client/addClientSchema";
import z from "zod";




export type NewClientDataType = z.infer<typeof addClientSchema>;

