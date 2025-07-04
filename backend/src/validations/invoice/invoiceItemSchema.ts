import z from "zod";

export const invoiceItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string()
    .min(1, "Description must be at least 1 character")
    .max(100, "Description must be at most 100 character"),
  unitPrice: z.number(),
  quantity: z.number(),
  totalPrice: z.number(),
});
